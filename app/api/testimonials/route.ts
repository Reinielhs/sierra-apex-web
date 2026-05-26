import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Rate limiting: máx 3 testimonios por IP por día
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
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

  const { name, rating, comment } = body;

  if (!comment?.trim()) {
    return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
  }

  const parsedRating = Math.min(5, Math.max(1, Number(rating) || 5));

  const { error } = await supabase.from('testimonials').insert([{
    name: String(name?.trim() || 'Cliente Anónimo').slice(0, 200),
    rating: parsedRating,
    comment: String(comment.trim()).slice(0, 2000),
    status: 'Pendiente',
  }]);

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
