import { NextResponse } from "next/server";
import { fetchCoinData } from "@/lib/coinmarketcap";

export async function GET() {
  try {
    const coins = await fetchCoinData(); // defaults to BTC,LTC,USDT,VTC
    return NextResponse.json(coins);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
