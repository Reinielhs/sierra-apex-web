import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifyAdmin(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user } } = await getServiceClient().auth.getUser(token);
  return user;
}

// PATCH /api/admin/leads — update lead status
export async function PATCH(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await request.json();
  if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { error } = await getServiceClient().from('leads').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: 'Database error' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
