// lib/session.ts
import { cookies } from 'next/headers';
import type { NeoSession } from './kotakNeoClient';

const COOKIE_NAME = 'neo_session';

export function saveSession(session: NeoSession) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 6 * 60 * 60, // 6 hours – adjust to token TTL
  });
}

export function loadSession(): NeoSession | null {
  const cookieStore = cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as NeoSession;
  } catch {
    return null;
  }
}
