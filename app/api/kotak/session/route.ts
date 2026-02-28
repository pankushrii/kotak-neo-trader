// app/api/kotak/session/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { saveSession } from '@/lib/session';
import type { NeoSession } from '@/lib/kotakNeoClient';

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Example shape – align this to your Notion doc:
  // { ucc, totp, mpin } or maybe pre-generated TRADING_TOKEN/SID
  // const { ucc, totp, mpin } = body;

  // TODO: Call Kotak's login + TOTP APIs here, using consumer_key and env
  // from process.env to obtain baseUrl, tradingToken, tradingSid.

  const session: NeoSession = {
    baseUrl: process.env.NEO_BASE_URL!,    // or derive from API response
    tradingToken: process.env.NEO_TRADING_TOKEN!,
    tradingSid: process.env.NEO_TRADING_SID!,
  };

  saveSession(session);

  return NextResponse.json({ ok: true });
}
