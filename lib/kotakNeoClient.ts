// lib/kotakNeoClient.ts
export type NeoEnvironment = 'uat' | 'prod';

export interface NeoSession {
  baseUrl: string;
  tradingToken: string;
  tradingSid: string;
  // If your Notion doc mentions server_id or similar, add it here.
}

export interface PlaceOrderPayload {
  exchange_segment: string;
  product: string;
  quantity: number;
  trading_symbol: string;
  order_type: 'MARKET' | 'LIMIT'; // extend as per docs
  price?: number;
  // ...other fields from Kotak Notion doc
}

// Generic helper
async function neoRequest<T>(
  session: NeoSession,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${session.baseUrl}${path}`;

  // TODO: Map these to the exact headers / auth schema from Kotak docs.
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    // 'trading-token': session.tradingToken,
    // 'sid': session.tradingSid,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Neo API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function placeOrder(
  session: NeoSession,
  payload: PlaceOrderPayload
) {
  // As per official docs: {BASE_URL}/quick/order/rule/ms/place.[web:4]
  return neoRequest<any>(session, '/quick/order/rule/ms/place', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getPositions(session: NeoSession) {
  // The Python SDK exposes client.positions(); check Notion/SDK to map to HTTP path.[web:3][web:10]
  return neoRequest<any>(session, '/positions', {
    method: 'GET',
  });
}

export interface QuoteRequest {
  instrument_tokens: { instrument_token: string; exchange_segment: string }[];
  quote_type?: string; // '', 'ltp', 'ohlc', 'market_depth', etc.[web:6]
}

export async function getQuotes(
  session: NeoSession,
  body: QuoteRequest
) {
  // The Quotes API accepts instrument_tokens and quote_type; exact REST path is from docs.[web:6]
  return neoRequest<any>(session, '/quotes', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
