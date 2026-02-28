// app/api/kotak/positions/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { loadSession } from '@/lib/session';
import { getPositions } from '@/lib/kotakNeoClient';

export async function GET() {
  const session = loadSession();
  if (!session) {
    return NextResponse.json({ error: 'No Kotak session' }, { status: 401 });
  }

  try {
    const resp = await getPositions(session);
    return NextResponse.json(resp);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
