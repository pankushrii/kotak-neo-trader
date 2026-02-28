'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [totp, setTotp] = useState('');
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/kotak/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totp, mpin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      window.location.href = '/';
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl mb-4">Connect Kotak Neo Session</h2>
      <p className="mb-4 text-sm text-slate-400">
        Enter your TOTP and MPIN (or whatever fields your Notion flow prescribes) to start a trade
        session. These are only sent server-to-server and never stored in the browser.
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
          placeholder="TOTP code"
          value={totp}
          onChange={(e) => setTotp(e.target.value)}
        />
        <input
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
          placeholder="MPIN"
          type="password"
          value={mpin}
          onChange={(e) => setMpin(e.target.value)}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? 'Connecting…' : 'Start Session'}
        </button>
      </form>
    </div>
  );
}
