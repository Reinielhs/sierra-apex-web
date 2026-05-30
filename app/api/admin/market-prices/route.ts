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

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make');
  const model = searchParams.get('model');
  const year = searchParams.get('year');
  const miles = searchParams.get('miles');

  if (!make || !model || !year) {
    return NextResponse.json({ error: 'Missing make, model, or year' }, { status: 400 });
  }

  const apiKey = process.env.MARKETCHECK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'MarketCheck API key not configured' }, { status: 500 });
  }

  const zip = process.env.DEALER_ZIP_CODE || '33101';

  const url = new URL('https://marketcheck-prod.apigee.net/v2/search/car/active');
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('year', year);
  url.searchParams.set('make', make);
  url.searchParams.set('model', model);
  url.searchParams.set('zip', zip);
  url.searchParams.set('radius', '75');
  url.searchParams.set('rows', '6');
  url.searchParams.set('sort_by', 'price');
  url.searchParams.set('sort_order', 'asc');
  if (miles) url.searchParams.set('mileage_max', String(Math.round(Number(miles) * 1.25)));

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: 'MarketCheck error', detail: text }, { status: 502 });
    }
    const data = await response.json();

    const listings = (data.listings || []).map((l: any) => ({
      price: l.price,
      miles: l.miles,
      trim: l.trim || '',
      dealer: l.dealer?.name || '',
      city: l.dealer?.city || '',
      state: l.dealer?.state || '',
      distance: l.dist ? Math.round(l.dist) : null,
      url: l.vdp_url || null,
    }));

    const prices = listings.map((l: any) => l.price).filter(Boolean);
    const stats = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length),
      count: data.num_found || listings.length,
    } : null;

    return NextResponse.json({ listings, stats });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 502 });
  }
}
