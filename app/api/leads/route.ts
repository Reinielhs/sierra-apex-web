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

async function notifySlack(text: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch {
    // Slack notification failure should not block lead submission
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

  // Validación básica
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
    await notifySlack(`💬 *¡NUEVO MENSAJE EN EL CHAT DE LA WEB!* 💬\n\n*Mensaje:* ${message}`);
  } else {
    await notifySlack(
      `🚀 *¡NUEVO LEAD DE VEHÍCULO!* 🚀\n\n*Vehículo:* ${car_title}\n*Cliente:* ${name || 'Anónimo'}\n*Email:* ${email || 'N/A'}\n*Teléfono:* ${phone || 'N/A'}\n*Mensaje:* ${message || 'Sin mensaje adicional.'}`
    );
  }

  return NextResponse.json({ ok: true });
}
