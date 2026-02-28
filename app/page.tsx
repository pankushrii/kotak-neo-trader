'use client';

import { useEffect, useState } from 'react';

interface SimpleQuote {
  instrument_token?: string;
  ltp?: number;
}

interface PositionRow {
  trdSym?: string;
  exSeg?: string;
  netQty?: number;
  pnl?: number;
  [key: string]: any;
}

export default function Dashboard() {
  const [symbol, setSymbol] = useState('NIFTY');
  const [instrumentToken, setInstrumentToken] = useState('11536'); // example token
  const [segment, setSegment] = useState('nse_cm');
  const [quantity, setQuantity] = useState(50);
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quote, setQuote] = useState<SimpleQuote | null>(null);
  const [positions, setPositions] = useState<PositionRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/kotak/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instrument_tokens: [
            {
              instrument_token: instrumentToken,
              exchange_segment: segment
            }
          ],
          quote_type: 'ltp'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch quote');

      // Shape depends on Neo response; adapt as necessary.
      const first = data?.data?.[0] ?? data?.data ?? data;
      setQuote({
        instrument_token: first?.instrument_token,
        ltp: first?.ltp ?? first?.last_traded_price
      });
    } catch (e: any) {
      setError(e.message);
    }
  };

  const fetchPositions = async () => {
    setError(null);
    try {
      const res = await fetch('/api/kotak/positions');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch positions');
      const rows: PositionRow[] = data?.data ?? data ?? [];
      setPositions(rows);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const placeMarketOrder = async () => {
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/kotak/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exchange_segment: segment,
          product: 'NRML',
          quantity,
          trading_symbol: symbol,
          order_type: 'MARKET',
          side
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');

      const orderId =
        data?.data?.order_id ??
        data?.order_id ??
        data?.data?.[0]?.order_id ??
        'see logs';
      setMessage(`Order placed successfully. Ref: ${orderId}`);
      fetchPositions();
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchPositions().catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Quick Market Order</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-xs text-slate-400">
            Symbol
            <input
              className="block w-32 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
          </label>
          <label className="text-xs text-slate-400">
            Instrument token
            <input
              className="block w-32 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
              value={instrumentToken}
              onChange={(e) => setInstrumentToken(e.target.value)}
            />
          </label>
          <label className="text-xs text-slate-400">
            Segment
            <select
              className="block w-32 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
            >
              <option value="nse_cm">NSE CM</option>
              <option value="nse_fo">NSE FO</option>
              <option value="bse_cm">BSE CM</option>
            </select>
          </label>
          <label className="text-xs text-slate-400">
            Qty
            <input
              className="block w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>
          <label className="text-xs text-slate-400">
            Side
            <select
              className="block w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
              value={side}
              onChange={(e) => setSide(e.target.value as 'BUY' | 'SELL')}
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </label>

          <button
            onClick={placeMarketOrder}
            className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium"
          >
            Place MARKET Order
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={fetchQuote}
            className="rounded bg-slate-800 px-3 py-1.5 text-xs font-medium"
          >
            Refresh LTP
          </button>
          {quote && (
            <p className="text-sm text-slate-300">
              LTP for {symbol} ({quote.instrument_token || 'token'}):{' '}
              <span className="font-mono">{quote.ltp}</span>
            </p>
          )}
        </div>

        {message && (
          <p className="text-sm text-emerald-300 whitespace-pre-wrap">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400 whitespace-pre-wrap">{error}</p>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-lg">Open Positions</h2>
        <button
          onClick={fetchPositions}
          className="rounded bg-slate-800 px-3 py-1.5 text-xs font-medium"
        >
          Refresh Positions
        </button>
        <div className="mt-2 border border-slate-800 rounded text-sm overflow-hidden">
          <div className="grid grid-cols-4 bg-slate-900/70 px-3 py-2 font-medium">
            <span>Symbol</span>
            <span>Segment</span>
            <span className="text-right">Net Qty</span>
            <span className="text-right">PnL</span>
          </div>
          {positions.length === 0 && (
            <div className="px-3 py-3 text-slate-500">No open positions.</div>
          )}
          {positions.map((p, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 px-3 py-2 border-t border-slate-800"
            >
              <span>{p.trdSym ?? p.symbol}</span>
              <span>{p.exSeg ?? p.exchange_segment}</span>
              <span className="text-right">
                {p.netQty ??
                  p.netqty ??
                  p.flBuyQty - (p.flSellQty ?? 0) ??
                  0}
              </span>
              <span className="text-right">
                {p.pnl ?? p.m2mPnL ?? p.unrealizedPnL ?? 0}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
