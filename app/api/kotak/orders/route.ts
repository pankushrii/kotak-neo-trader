// app/api/kotak/quotes/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { loadSession } from '@/lib/session';
import { getQuotes } from '@/lib/kotakNeoClient';

export async function POST(req: NextRequest) {
  const session = loadSession();
  if (!session) {
    return NextResponse.json({ error: 'No Kotak session' }, { status: 401 });
  }

  const body = await req.json();

  // Expect body like: { instruments: [{ token, segment }], quote_type }
  const payload = {
    instrument_tokens: body.instruments.map((x: any) => ({
      instrument_token: x.token,
      exchange_segment: x.segment,
    })),
    quote_type: body.quote_type || '',
  };

  try {
    const data = await getQuotes(session, payload);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
