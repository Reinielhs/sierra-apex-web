import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Rate limiting: máx 5 envíos por IP por hora
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

const MONTHLY_EMAIL_CAP = 2999;

async function getMonthlyLeadCount(): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString());
  return count ?? 0;
}

async function notifyEmail(subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const monthlyCount = await getMonthlyLeadCount();
  if (monthlyCount > MONTHLY_EMAIL_CAP) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sierra Apex <notificaciones@sierraapexgroup.com>',
        to: ['reiniel@sierraapexgroup.com'],
        subject,
        text,
      }),
    });
  } catch {
    // Email failure should not block lead submission
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { name, email, phone, message, car_title, type } = body;

  if (type !== 'chat' && !email && !phone) {
    return NextResponse.json({ error: 'Email or phone required' }, { status: 400 });
  }

  const { error } = await supabase.from('leads').insert([{
    name: String(name || 'Cliente Anónimo').slice(0, 200),
    email: email ? String(email).slice(0, 200) : null,
    phone: phone ? String(phone).slice(0, 50) : null,
    message: message ? String(message).slice(0, 1000) : null,
    car_title: car_title ? String(car_title).slice(0, 200) : null,
    status: 'Nuevo',
  }]);

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (type === 'chat') {
    await notifyEmail(
      '💬 Nuevo mensaje - Chat Sierra Apex Web',
      `Nuevo mensaje desde el chat de la web:\n\nMensaje: ${message}`
    );
  } else {
    await notifyEmail(
      `🚀 Nuevo lead - ${car_title}`,
      `Nuevo lead de vehículo:\n\nVehículo: ${car_title}\nCliente: ${name || 'Anónimo'}\nEmail: ${email || 'N/A'}\nTeléfono: ${phone || 'N/A'}\nMensaje: ${message || 'Sin mensaje adicional.'}`
    );
  }

  return NextResponse.json({ ok: true });
}
