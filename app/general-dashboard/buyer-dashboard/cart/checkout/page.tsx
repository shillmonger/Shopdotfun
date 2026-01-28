"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  CreditCard,
  Building2,
  Wallet,
  Landmark,
  ArrowLeft,
  CircleDollarSign,
  Coins,
  Bitcoin,
  Plus,
  Truck,
  ShieldCheck,
  Lock,
  ChevronRight,
  Info,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

interface OrderGroup {
  seller: string;
  items: CartItem[];
  shipping: number;
  estArrival: string;
}

export default function CheckoutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vtc");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(true);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const response = await fetch("/api/buyer/addresses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        setAddresses(data.addresses || []);
        // Set default address if available
        const defaultAddress = data.addresses?.find(
          (addr: Address) => addr.isDefault,
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        } else if (data.addresses?.length > 0) {
          setSelectedAddress(data.addresses[0]._id);
        }
      } else {
        if (response.status !== 401) {
          console.error("Failed to fetch addresses:", data.error);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setAddressLoading(false);
    }
  };

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/buyer/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        setCartItems(data.items || []);
      } else {
        if (response.status !== 401) {
          console.error("Failed to fetch cart:", data.error);
          toast.error("Failed to load cart items");
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchCart();
  }, []);

  // Group cart items by seller
  const orderGroups: OrderGroup[] = cartItems.reduce(
    (groups: OrderGroup[], item) => {
      const existingGroup = groups.find(
        (group) => group.seller === item.sellerName,
      );
      if (existingGroup) {
        existingGroup.items.push(item);
        existingGroup.shipping += item.shippingFee;
      } else {
        groups.push({
          seller: item.sellerName,
          items: [item],
          shipping: item.shippingFee,
          estArrival: "Jan 22 - Jan 25", // You can calculate this dynamically
        });
      }
      return groups;
    },
    [],
  );

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice =
      item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
    return acc + itemPrice * item.quantity;
  }, 0);
  const totalShipping = cartItems.reduce(
    (acc, item) => acc + item.shippingFee,
    0,
  );
  const grandTotal = subtotal + totalShipping;

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
            {/* Page Title */}
            <div className="mb-10 text-left">
              <div className="flex items-center gap-4 text-left">
                <Link
                  href="/general-dashboard/buyer-dashboard/cart"
                  className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>

                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                  Checkout
                </h1>
              </div>

              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary" />
                Encrypted Transaction
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* LEFT COLUMN: Details */}
              <div className="lg:col-span-7 space-y-10">
                {/* A. Delivery Address */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <span className="bg-foreground text-background w-6 h-6 flex items-center justify-center rounded-full text-[10px]">
                        01
                      </span>
                      Delivery Address
                    </h2>
                    <Link
                      href="/general-dashboard/buyer-dashboard/profile-settings"
                      className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3 h-3" /> Add New
                    </Link>
                  </div>

                  <div className="grid gap-4">
                    {addressLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="bg-muted/50 border-2 border-dashed border-border rounded-2xl p-8 text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-bold text-muted-foreground mb-3">
                          No delivery addresses found
                        </p>
                        <Link
                          href="/general-dashboard/buyer-dashboard/profile-settings"
                          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline"
                        >
                          <Plus className="w-3 h-3" /> Add Your First Address
                        </Link>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddress(addr._id)}
                          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedAddress === addr._id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground/30 bg-card"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                              <MapPin
                                className={`w-5 h-5 mt-0.5 ${selectedAddress === addr._id ? "text-primary" : "text-muted-foreground"}`}
                              />
                              <div>
                                <p className="font-black uppercase text-xs tracking-tighter">
                                  {addr.fullName}
                                  {addr.isDefault && (
                                    <span className="ml-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[8px]">
                                      Default
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {addr.street}, {addr.city}, {addr.state},{" "}
                                  {addr.country}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {addr.phone}
                                </p>
                              </div>
                            </div>
                            {selectedAddress === addr._id && (
                              <div className="bg-primary text-primary-foreground p-1 rounded-full">
                                <ShieldCheck className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* B. Order Summary (Grouped) */}
                <section>
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                    <span className="bg-foreground text-background w-6 h-6 flex items-center justify-center rounded-full text-[10px]">
                      02
                    </span>
                    Review Order
                  </h2>
                  <div className="space-y-6">
                    {loading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : orderGroups.length === 0 ? (
                      <div className="bg-muted/50 border-2 border-dashed border-border rounded-2xl p-8 text-center">
                        <AlertCircle className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-bold text-muted-foreground mb-3">
                          Your cart is empty
                        </p>
                        <Link
                          href="/general-dashboard/buyer-dashboard/browse-product"
                          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline"
                        >
                          Browse Products
                        </Link>
                      </div>
                    ) : (
                      orderGroups.map((group, idx) => (
                        <div
                          key={idx}
                          className="bg-card border border-border rounded-2xl overflow-hidden"
                        >
                          <div className="bg-muted/50 px-5 py-3 border-b border-border flex justify-between items-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                              {group.seller}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                              <Truck className="w-3 h-3" /> {group.estArrival}
                            </div>
                          </div>
                          <div className="p-5 space-y-4">
                            {group.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center"
                              >
                                <div className="flex gap-3">
                                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden border border-border">
                                    <img
                                      src={item.image}
                                      alt={item.productName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold uppercase italic tracking-tighter">
                                      {item.productName}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-bold">
                                      QTY: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {item.discount > 0 && (
                                    <p className="text-[10px] text-muted-foreground line-through font-bold">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  )}
                                  <p className="text-sm font-black">
                                    $
                                    {(
                                      item.price *
                                      (1 - item.discount / 100) *
                                      item.quantity
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div className="pt-4 border-t border-dashed border-border flex justify-between items-center">
                              <p className="text-[10px] font-black uppercase text-muted-foreground">
                                Shipping for this seller
                              </p>
                              <p className="text-xs font-bold">
                                ${group.shipping.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* C. Payment Method */}
                <section>
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                    <span className="bg-foreground text-background w-6 h-6 flex items-center justify-center rounded-full text-[10px]">
                      03
                    </span>
                    Crypto Payment
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        id: "vtc",
                        img: "https://i.postimg.cc/GpG8VMT5/Vertcoin.png",
                        label: "Vertcoin (VAT)",
                      },
                      {
                        id: "btc",
                        img: "https://i.postimg.cc/3wn94Jn0/bitcoin.jpg",
                        label: "Bitcoin (BTC)",
                      },
                      {
                        id: "ltc",
                        img: "https://i.postimg.cc/59YdVZ2N/litecoin.jpg",
                        label: "Litecoin (LTC)",
                      },
                      {
                        id: "usdt",
                        img: "https://i.postimg.cc/zGN9TvSg/tether.jpg",
                        label: "USDT (Bep20)",
                      },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center cursor-pointer gap-3 p-6 rounded-2xl border-2 transition-all ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <img
                          src={method.img}
                          alt={method.label}
                          className={`w-10 h-10 rounded-full object-cover transition-all ${
                            paymentMethod === method.id
                              ? "grayscale-0 scale-110"
                              : "grayscale opacity-70"
                          }`}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {method.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Final Confirmation */}
              <div className="lg:col-span-5">
                <div className="bg-foreground text-background rounded-3xl p-8 sticky top-8 shadow-2xl">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 border-b border-background/20 pb-4">
                    Final Amount
                  </h3>

                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between opacity-70">
                      <span className="text-xs font-black uppercase tracking-widest">
                        Subtotal
                      </span>
                      <span className="text-sm font-bold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between opacity-70">
                      <span className="text-xs font-black uppercase tracking-widest">
                        Shipping Total
                      </span>
                      <span className="text-sm font-bold">
                        ${totalShipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-[1px] bg-background/20 my-4" />
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black uppercase tracking-widest">
                        Grand Total
                      </span>
                      <span className="text-4xl font-black italic tracking-tighter">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-background/10 rounded-2xl p-4 mb-8 flex items-start gap-3 border border-background/10">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-[10px] leading-relaxed font-medium uppercase tracking-tighter">
                      By clicking &quot;Confirm Order&quot;, you agree to our
                      Terms of Service. Your card will be charged immediately.
                    </p>
                  </div>

                  <Link
                    href="/general-dashboard/buyer-dashboard/cart/checkout/pay"
                    className="w-full bg-primary text-primary-foreground py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer"
                  >
                    Confirm & Place Order <ChevronRight className="w-4 h-4" />
                  </Link>

                  <p className="text-center text-[9px] font-black uppercase tracking-widest mt-6 opacity-40 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> SSL Secure Checkout
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
