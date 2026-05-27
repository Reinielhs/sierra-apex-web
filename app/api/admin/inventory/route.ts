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

// POST /api/admin/inventory — create or update vehicle
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, payload, stock } = await request.json();

  let error;
  if (id) {
    ({ error } = await getServiceClient().from('inventory').update(payload).eq('id', id));
  } else {
    ({ error } = await getServiceClient().from('inventory').insert([{ ...payload, stock, leads: 0, days_on_market: 0 }]));
  }

  if (error) return NextResponse.json({ error: 'Database error' }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// PATCH /api/admin/inventory — update status or sort_order
export async function PATCH(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, sort_order } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (status !== undefined) updates.status = status;
  if (sort_order !== undefined) updates.sort_order = sort_order;
  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });

  const { error } = await getServiceClient().from('inventory').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: 'Database error' }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/inventory — delete vehicle
export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await getServiceClient().from('inventory').delete().eq('id', id);
  if (error) return NextResponse.json({ error: 'Database error' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
