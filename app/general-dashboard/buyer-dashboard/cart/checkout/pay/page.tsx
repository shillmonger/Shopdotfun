"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Copy,
  ShieldCheck,
  ExternalLink,
  Info,
  Coins,
  Lock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

export default function PayPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<
    "vtc" | "btc" | "ltc" | "usdt"
  >("vtc");
  const [amountUSD, setAmountUSD] = useState(342.5);
  const [cryptoAmount, setCryptoAmount] = useState("0.00");
  const [walletAddress, setWalletAddress] = useState("vtc1qkh4ccr27f5c9yp44vmnud7ljgvfqh5s6hy0f54");

  const getMockAddress = (method: string) => {
    if (method === "vtc")
      return "vtc1qkh4ccr27f5c9yp44vmnud7ljgvfqh5s6hy0f54";
    if (method === "btc")
      return "bc1q8edkes3zuja3tan33gdz8tg6cpu49k96lvwyr5";
    if (method === "ltc") return "ltc1q0c3r0qs09dzz9gq09a0my7ykp7ns73epwk8pk8";
    if (method === "usdt")
      return "0xafcaa087adfcb53ff2900975d6d299fea976f4ba";
    return "";
  };

  const getCryptoData = () => {
    const data = {
      vtc: {
        name: "Vertcoin",
        img: "https://i.postimg.cc/GpG8VMT5/Vertcoin.png",
        qr: "https://i.postimg.cc/9XbVQksX/POLYGON.jpg", // Mapped to VAT/POLYGON per your request
      },
      btc: {
        name: "Bitcoin",
        img: "https://i.postimg.cc/3wn94Jn0/bitcoin.jpg",
        qr: "https://i.postimg.cc/1zj5XqLX/BCH.jpg", // Mapped to BCH per your request
      },
      ltc: {
        name: "Litecoin",
        img: "https://i.postimg.cc/59YdVZ2N/litecoin.jpg",
        qr: "https://i.postimg.cc/yxMzChgh/eth.jpg", // Mapped to ETH per your request
      },
      usdt: {
        name: "Tether USDT",
        img: "https://i.postimg.cc/zGN9TvSg/tether.jpg",
        qr: "https://i.postimg.cc/PJtwzZrK/ton.jpg", // Mapped to TON per your request
      },
    };
    return data[paymentMethod];
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied!", {
      description: "Paste it into your wallet app.",
      icon: <CheckCircle2 className="text-green-500" />,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto pb-32 pt-8 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-4">
                <Link
                  href="/general-dashboard/buyer-dashboard/cart/checkout"
                  className="p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                  Payment
                </h1>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" /> Secure Crypto Payment
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Main Payment Card */}
              <div className="lg:col-span-7">
                <div className="bg-card border border-border rounded-3xl p-5 md:p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border">
                        <img
                          src={getCryptoData().img}
                          alt={getCryptoData().name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">
                          {getCryptoData().name}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Transfer to the secure address below
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Address Section */}
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-2">
                        Send To This Address
                      </label>
                      <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-2xl px-4 py-2">
                        <div className="flex-1 font-mono text-sm break-all select-all">
                          {walletAddress}
                        </div>
                        <button
                          onClick={copyToClipboard}
                          className="p-3 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors cursor-pointer"
                          title="Copy address"
                        >
                          <Copy className="w-5 h-5 text-primary" />
                        </button>
                      </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="flex justify-center my-8">
                      <div className="w-56 h-56 bg-white rounded-2xl p-4 flex flex-col items-center justify-center border-8 border-background shadow-inner">
                        <img 
                          src={getCryptoData().qr} 
                          alt="Scan to pay" 
                          className="w-full h-full cursor-pointer object-contain mb-2"
                        />
                        <span className="text-black text-[10px] font-black uppercase tracking-tighter">
                          Scan to pay
                        </span>
                      </div>
                    </div>

                    <div className="bg-background/5 border border-background/10 rounded-2xl space-y-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm leading-relaxed">
                          Send{" "}
                          <strong>
                            exactly {cryptoAmount} {paymentMethod.toUpperCase()}
                          </strong>{" "}
                          to the address above. Always verify the address before
                          sending.
                        </p>
                      </div>

                      {paymentMethod === "usdt" && (
                        <div className="flex items-start gap-3">
                          <Coins className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                          <p className="text-sm leading-relaxed">
                            Use <strong>TRC20 (Tron)</strong> network — sending
                            via other networks will result in lost funds.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 mt-5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{paymentMethod.toUpperCase()} is active </span>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-70 transition-opacity">
                        View Live Rate <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
              </div>

              {/* Right Column - Summary & Safety */}
              <div className="lg:col-span-5">
                <div className="bg-foreground text-background rounded-3xl p-8 sticky top-8 shadow-2xl">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">
                    Payment Summary
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-80 uppercase font-bold text-[10px]">
                        Order Total
                      </span>
                      <span className="font-bold">${amountUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-80 uppercase font-bold text-[10px]">
                        Crypto Amount
                      </span>
                      <span className="font-bold">
                        {cryptoAmount} {paymentMethod.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-80 uppercase font-bold text-[10px]">
                        Rate locked for
                      </span>
                      <span className="font-bold">
                        5 minutes
                      </span>
                    </div>
                    <div className="h-px bg-background/20 my-4" />
                    <div className="flex justify-between items-center gap-1 w-full">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        Amount to Pay
                      </span>

                      <span className="text-3xl font-black italic tracking-tighter">
                        {cryptoAmount} {paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-background/10 rounded-2xl p-5 mb-8 border border-background/10">
                    <div className="flex items-start gap-3">
                      <p className="text-[10px] leading-relaxed uppercase tracking-tight font-black">
                        Only send to the displayed address - Verified SSL Secure
                        Gateway.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/general-dashboard/buyer-dashboard/orders"
                    className="w-full block bg-green-600 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-center hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 cursor-pointer active:scale-95"
                  >
                    I have made this payment
                  </Link>

                  {/* Support Notice */}
                  <p className="text-center text-[9px] mt-4 opacity-60 font-bold uppercase tracking-tight">
                    If payment delays more than 30 minutes, contact us at{' '}
                    <Link href="/support" className="underline hover:opacity-100 transition-opacity">
                      Customer Support
                    </Link>
                  </p>

                  <p className="text-center text-[10px] mt-6 opacity-40 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" /> Encrypted Transaction
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}