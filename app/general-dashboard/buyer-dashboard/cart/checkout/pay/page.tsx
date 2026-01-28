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
  Truck,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import QRCode from "react-qr-code";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

interface CartItem {
  productId: string;
  productName: string;
  sellerName: string;
  price: number;
  discount: number;
  quantity: number;
  stock: number;
  shippingFee: number;
  image: string;
  addedAt: string;
}

interface OrderGroup {
  seller: string;
  items: CartItem[];
  shipping: number;
  estArrival: string;
}

interface CheckoutData {
  cartItems: CartItem[];
  orderGroups: OrderGroup[];
  selectedAddress: string;
  paymentMethod: string;
  subtotal: number;
  totalShipping: number;
  grandTotal: number;
}

export default function PayPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();

  const [paymentMethod, setPaymentMethod] = useState<
    "vtc" | "btc" | "ltc" | "usdt"
  >("vtc");
  const [amountUSD, setAmountUSD] = useState(342.5);
  const [cryptoAmount, setCryptoAmount] = useState("0.00");
  const [walletAddress, setWalletAddress] = useState(
    "vtc1qkh4ccr27f5c9yp44vmnud7ljgvfqh5s6hy0f54",
  );
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cryptoPrices, setCryptoPrices] = useState<{ [key: string]: number }>(
    {},
  );
  const [timeLeft, setTimeLeft] = useState(3000); // 50 minutes in seconds
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch live crypto prices
  const fetchCryptoPrices = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/coinmarketcap");
      const data = await response.json();

      if (data.error) {
        console.error("API Error:", data.error);
        return;
      }

      const prices: { [key: string]: number } = {};

      // Extract prices for each crypto
      if (data.BTC) prices.BTC = data.BTC.quote.USD.price;
      if (data.LTC) prices.LTC = data.LTC.quote.USD.price;
      if (data.USDT) prices.USDT = data.USDT.quote.USD.price;
      if (data.VTC) prices.VTC = data.VTC.quote.USD.price;

      setCryptoPrices(prices);
      setTimeLeft(3000); // Reset timer to 50 minutes
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate crypto amount based on current price
  const calculateCryptoAmount = () => {
    const price = cryptoPrices[paymentMethod.toUpperCase()];
    if (price && amountUSD > 0) {
      const amount = amountUSD / price;
      setCryptoAmount(amount.toFixed(8));
    } else {
      setCryptoAmount("0.00");
    }
  };

  useEffect(() => {
    // Get payment method from URL params
    const method = searchParams.get("method") as "vtc" | "btc" | "ltc" | "usdt";
    if (method) {
      setPaymentMethod(method);
    }

    // Get total from URL params
    const total = searchParams.get("total");
    if (total) {
      setAmountUSD(parseFloat(total));
    }

    // Get checkout data from localStorage
    const storedData = localStorage.getItem("checkoutData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setCheckoutData(data);
      } catch (error) {
        console.error("Error parsing checkout data:", error);
      }
    }

    setLoading(false);
  }, [searchParams]);

  // Fetch prices on component mount and when payment method changes
  useEffect(() => {
    fetchCryptoPrices();
  }, [paymentMethod]);

  // Calculate crypto amount when prices or USD amount changes
  useEffect(() => {
    calculateCryptoAmount();
  }, [cryptoPrices, amountUSD, paymentMethod]);

  // Update wallet address when payment method changes
  useEffect(() => {
    setWalletAddress(getMockAddress(paymentMethod));
  }, [paymentMethod]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up, refresh prices
          fetchCryptoPrices();
          return 3000; // Reset to 50 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentMethod]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMockAddress = (method: string) => {
    if (method === "vtc") return "vtc1qkh4ccr27f5c9yp44vmnud7ljgvfqh5s6hy0f54";
    if (method === "btc") return "bc1q8edkes3zuja3tan33gdz8tg6cpu49k96lvwyr5";
    if (method === "ltc") return "ltc1q0c3r0qs09dzz9gq09a0my7ykp7ns73epwk8pk8";
    if (method === "usdt") return "0xafcaa087adfcb53ff2900975d6d299fea976f4ba";
    return "";
  };

  // Get QR value with proper crypto URI format
  const getQRValue = () => {
    if (cryptoAmount === "0.00" || !walletAddress) {
      return walletAddress || "";
    }

    const uriMap: { [key: string]: string } = {
      btc: `bitcoin:${walletAddress}?amount=${cryptoAmount}`,
      ltc: `litecoin:${walletAddress}?amount=${cryptoAmount}`,
      vtc: `vertcoin:${walletAddress}?amount=${cryptoAmount}`,
      usdt: `bsc:${walletAddress}?amount=${cryptoAmount}`,
    };

    return uriMap[paymentMethod] || walletAddress;
  };

  const getCryptoData = () => {
    const data = {
      vtc: {
        name: "Vertcoin",
        img: "https://i.postimg.cc/GpG8VMT5/Vertcoin.png",
      },
      btc: {
        name: "Bitcoin",
        img: "https://i.postimg.cc/3wn94Jn0/bitcoin.jpg",
      },
      ltc: {
        name: "Litecoin",
        img: "https://i.postimg.cc/59YdVZ2N/litecoin.jpg",
      },
      usdt: {
        name: "Tether USDT",
        img: "https://i.postimg.cc/zGN9TvSg/tether.jpg",
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
              {/* Left Column - Payment */}
              <div className="lg:col-span-7 space-y-8">
                {/* Payment Card */}
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
                        <div
                          className="
      flex-1 font-mono text-sm select-all
      overflow-hidden text-ellipsis whitespace-nowrap
      sm:whitespace-normal sm:break-all
    "
                          title={walletAddress}
                        >
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
                        <QRCode
                          value={getQRValue()}
                          size={192}
                          level="M"
                          className="cursor-pointer"
                        />
                        <span className="text-black text-[10px] font-black uppercase tracking-tighter mt-2">
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
                            Use <strong>BEP20 (BSC)</strong> network — sending
                            via other networks will result in lost funds.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 mt-5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isRefreshing ? "bg-yellow-500 animate-pulse" : "bg-green-500 animate-pulse"}`}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {isRefreshing
                        ? "Updating rates..."
                        : `${paymentMethod.toUpperCase()} is active`}
                    </span>
                  </div>
                  <button
                    onClick={() => fetchCryptoPrices()}
                    disabled={isRefreshing}
                    className="text-[10px] font-black cursor-pointer uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-70 transition-opacity disabled:opacity-50"
                  >
                    {isRefreshing ? "Updating..." : "View Live Rate"}{" "}
                    <ExternalLink className="w-3 h-3" />
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
                        Rate locked for
                      </span>
                      <div className="flex items-center gap-2">
                        {isRefreshing ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <span className="font-bold">
                            {formatTime(timeLeft)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-80 uppercase font-bold text-[10px]">
                        Crypto Amount
                      </span>
                      <span className="font-bold">
                        {cryptoAmount} {paymentMethod.toUpperCase()}
                      </span>
                    </div>
                    <div className="h-px bg-background/20 my-4" />
                    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-1 w-full">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 text-center sm:text-left">
                        Amount to Pay
                      </span>

                      <span className="text-3xl font-black italic tracking-tighter text-center sm:text-left">
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
                    If payment delays more than 30 minutes, contact us at{" "}
                    <Link
                      href="/support"
                      className="underline hover:opacity-100 transition-opacity"
                    >
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
