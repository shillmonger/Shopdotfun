"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Truck,
  Timer,
  Search,
  Filter,
  Globe,
  Ban,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

/* ======================================================
 TYPES
====================================================== */

type Seller = {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string; // Fixed: Added to type
};

type Order = {
  id: string;
  productName: string;
  image: string;
  date: string;
  total: number;
  deliveryStatus: string;
  deadline: string;
  seller: Seller;
};

/* ======================================================
 COUNTDOWN COMPONENT
====================================================== */

const CountdownTimer = ({ deadline }: { deadline: string }) => {
  const [timeLeft, setTimeLeft] = useState("Loading...");

  useEffect(() => {
    const target = new Date(deadline).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
      {timeLeft}
    </span>
  );
};

/* ======================================================
 MOCK DATA
====================================================== */

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-99281",
    productName: "Noise Free Headset for Tech Professionals",
    image: "https://res.cloudinary.com/dcok2qze0/image/upload/v1769425451/shopdotfun/products/qyiqe1kj5chttkmlzazw.jpg",
    date: "Jan 18, 2026",
    total: 105,
    deliveryStatus: "Processing",
    deadline: "2026-02-05T00:00:00",
    seller: {
      name: "Code Lab HQ",
      email: "codelab042@gmail.com",
      phone: "+1 (555) 098-2234",
      country: "USA",
      address: "123 Tech Avenue, Silicon Valley, CA 94025",
    },
  },
];

const DELIVERY_ADDRESS = {
  fullName: "Determination Chidera",
  phone: "+23491368860",
  street: "33/34 diamond estate enugu",
  city: "Ebonyi",
  state: "Ikwo",
  country: "Nigeria",
};

/* ======================================================
 ORDER CARD
====================================================== */

function OrderCard({
  order,
  problem,
  onProblemChange,
  onAction,
  onSubmit,
}: {
  order: Order;
  problem: string;
  onProblemChange: (text: string) => void;
  onAction: (action: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-[2.5rem] shadow-sm hover:border-primary/40 transition-all duration-300 overflow-hidden">
      <div className="p-6 md:p-10">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              {order.id} <span className="mx-2 opacity-30">|</span> {order.date}
            </p>
            <h3 className="mt-2 text-2xl md:text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              {order.productName}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border">
              <span className="text-[9px] font-black uppercase opacity-50 tracking-widest">Time Left</span>
              <CountdownTimer deadline={order.deadline} />
            </div>
            <span className="text-[9px] font-black uppercase px-4 py-2 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/20 tracking-widest">
              {order.deliveryStatus}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cool Image Stack */}
          <div className="relative w-full lg:w-56 shrink-0 flex justify-center">
            {/* Background Decorative Layers */}
            <div className="absolute top-2 left-2 w-48 h-48 md:w-56 md:h-56 bg-primary/10 rounded-[2rem] -rotate-6 border border-primary/20" />
            <div className="absolute top-1 left-1 w-48 h-48 md:w-56 md:h-56 bg-muted rounded-[2rem] rotate-3 border border-border" />
            
            {/* Main Image */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-[2rem] overflow-hidden border-2 border-card shadow-2xl z-10 cursor-pointer">
              <img
                src={order.image}
                alt={order.productName}
                className="w-full h-full object-cover hover:scale-110 transition duration-500"
              />
            </div>
          </div>

          {/* Info Sections */}
          <div className="flex-1 grid md:grid-cols-2 gap-6">
            
            {/* Seller Info */}
            <div className="bg-muted/30 rounded-[2rem] p-6 border border-border/50 hover:bg-muted/50 transition cursor-pointer group">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Seller Profile
              </p>
              <p className="font-black italic uppercase text-lg mb-3 group-hover:text-primary transition">
                {order.seller.name}
              </p>
              <div className="space-y-2 text-[11px] font-bold text-muted-foreground uppercase">
                <p className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 opacity-60" /> {order.seller.country}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 opacity-60" /> {order.seller.phone}</p>
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 opacity-60" /> {order.seller.email}</p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-muted/30 rounded-[2rem] p-6 border border-border/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Destination
              </p>
              <p className="font-black text-sm uppercase mb-1">{DELIVERY_ADDRESS.fullName}</p>
              <p className="text-[11px] font-bold italic uppercase text-muted-foreground leading-relaxed">
                {DELIVERY_ADDRESS.street},<br />
                {DELIVERY_ADDRESS.city}, {DELIVERY_ADDRESS.state}<br />
                {DELIVERY_ADDRESS.country}
              </p>
              <p className="mt-2 text-[10px] font-black text-primary">{DELIVERY_ADDRESS.phone}</p>
            </div>
          </div>
        </div>

        {/* Price and Action Buttons */}
        <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="w-full md:w-auto text-center md:text-left">
            <p className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Amount Paid</p>
            <p className="text-5xl font-black italic tracking-tighter text-foreground">${order.total.toFixed(2)}</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto flex-wrap">

  {/* Received - Green */}
  <button
    onClick={() => onAction("Received")}
    className="flex-1 md:flex-none bg-green-600 cursor-pointer text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
  >
    <CheckCircle2 className="w-4 h-4" /> Received
  </button>

  {/* Delayed - Yellow/Amber */}
  <button
    onClick={() => onAction("Delayed")}
    className="flex-1 md:flex-none bg-amber-500 cursor-pointer text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
  >
    <Timer className="w-4 h-4" /> Delay
  </button>

  {/* Damaged - Red */}
  <button
    onClick={() => onAction("Damaged")}
    className="flex-1 md:flex-none bg-red-600 cursor-pointer text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
  >
    <Ban className="w-4 h-4" /> Damaged
  </button>

</div>

        </div>

        {/* Complaint Section */}
<div className="
  mt-8
  p-0 md:p-6
  bg-transparent md:bg-muted/20
  rounded-none md:rounded-[2rem]
  border-0 md:border md:border-dashed md:border-border
">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-2 block">
            Case Filing (Drag to expand)
          </label>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                placeholder="DESCRIBE YOUR PROBLEM IN DETAIL..."
                value={problem}
                onChange={(e) => onProblemChange(e.target.value)}
                className="w-full min-h-[80px] bg-background border border-border px-4 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl focus:ring-2 ring-primary/20 outline-none resize-y"
              />
            </div>
            <button
              onClick={onSubmit}
              className="w-full bg-foreground text-background cursor-pointer px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-xl"
            >
              Submit Support Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
 MAIN PAGE
====================================================== */

export default function BuyerOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [problems, setProblems] = useState<Record<string, string>>({});

  const handleAction = (id: string, action: string) => {
    toast.info(`${action} Request`, {
      description: `Notification sent for order ${id}`,
    });
  };

  const submitProblem = (id: string) => {
    if (!problems[id]) {
      toast.error("Description required");
      return;
    }
    toast.success("Case Opened", { description: "Support will contact you soon." });
    setProblems((p) => ({ ...p, [id]: "" }));
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Fixed Search/Filter Layout */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-2">
              <div className="w-full md:w-auto">
                <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  My <span className="text-primary not-italic">Orders</span>
                </h1>
                <p className="mt-4 text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-[0.3em]">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> Secure Escrow Active
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    placeholder="FIND ORDER ID..."
                    className="w-full md:w-72 pl-12 pr-4 h-10 rounded-lg border bg-card text-[10px] font-black uppercase tracking-widest focus:ring-2 ring-primary/20 outline-none transition-all"
                  />
                </div>
                <button className="border h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted transition cursor-pointer group">
                  <Filter className="w-4 h-4 group-hover:text-primary transition" />
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-10">
              {MOCK_ORDERS.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  problem={problems[order.id] || ""}
                  onProblemChange={(v) => setProblems({ ...problems, [order.id]: v })}
                  onAction={(a) => handleAction(order.id, a)}
                  onSubmit={() => submitProblem(order.id)}
                />
              ))}
            </div>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}