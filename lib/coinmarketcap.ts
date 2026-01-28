// lib/coinmarketcap.ts
export async function fetchCoinData(symbols: string[] = ["BTC","LTC","USDT","VTC"]) {
  const apiKey = process.env.COINMARKETCAP_API_KEY;

  if (!apiKey) throw new Error("COINMARKETCAP_API_KEY is not set in .env.local");

  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols.join(",")}`;

  const res = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`CoinMarketCap API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.data; // returns object keyed by symbol
}
