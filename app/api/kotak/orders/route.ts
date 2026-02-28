// app/api/kotak/orders/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { loadSession } from '@/lib/session';
import { placeOrder } from '@/lib/kotakNeoClient';

export async function POST(req: NextRequest) {
  const session = loadSession();
  if (!session) {
    return NextResponse.json({ error: 'No Kotak session' }, { status: 401 });
  }

  const body = await req.json();

  // Shape of body should match PlaceOrderPayload
  try {
    const resp = await placeOrder(session, body);
    return NextResponse.json(resp);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
