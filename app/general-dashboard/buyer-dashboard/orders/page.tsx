"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Clock, 
  Calendar,
  ExternalLink,
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Truck,
  Timer,
  ShieldCheck,
  Ban
} from "lucide-react";
import { toast } from "sonner";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";
import { Input } from "@/components/ui/input";

// --- Countdown Component ---
const CountdownTimer = ({ deadline }: { deadline: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date(deadline).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <span className="bg-primary/10 text-primary px-2 py-1 rounded font-black font-mono text-[9px] animate-pulse">
      {timeLeft}
    </span>
  );
};

// Mock Data updated with detailed Seller info
const MOCK_ORDERS = [
  {
    id: "ORD-99281",
    productName: "Noice free headset for tech boys",
    image: "https://res.cloudinary.com/dcok2qze0/image/upload/v1769425451/shopdotfun/products/qyiqe1kj5chttkmlzazw.jpg",
    date: "Jan 18, 2026",
    total: 105.00,
    deliveryStatus: "Processing",
    deadline: "2026-02-05T00:00:00",
    seller: {
      name: "Code Lab",
      email: "codelab042@gmail.com",
      phone: "+1 (555) 098-2234",
      address: "123 Tech Avenue, Silicon Valley, CA"
    }
  }
];

export default function BuyerOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [problemText, setProblemText] = useState<{ [key: string]: string }>({});

  const handleAction = (orderId: string, action: string) => {
    toast.info(`Request Sent: ${action}`, {
      description: `Order ${orderId} has been flagged for ${action.toLowerCase()}.`,
    });
  };

  const submitProblem = (orderId: string) => {
    if (!problemText[orderId]) return toast.error("Please describe the issue first");
    toast.success("Problem Submitted", {
      description: "Our support team and the seller have been notified.",
    });
    setProblemText(prev => ({ ...prev, [orderId]: "" }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-40 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">My <span className="text-primary not-italic">Purchases</span></h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary" /> Buyer Protection Active on All Orders
              </p>
            </div>

            <div className="space-y-8">
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                  {/* Top: Product & Order Status */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-48 h-48 bg-muted rounded-3xl overflow-hidden shrink-0 border border-border">
                      <img src={order.image} alt={order.productName} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">{order.productName}</h2>
                          </div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            Order ID: {order.id} • <Clock className="w-3 h-3" /> Process Time Left: <CountdownTimer deadline={order.deadline} />
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black italic">${order.total.toFixed(2)}</p>
                          <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            {order.deliveryStatus}
                          </span>
                        </div>
                      </div>

                      {/* Seller Detail Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><User className="w-3 h-3"/> Seller Contact</p>
                          <p className="text-[11px] font-bold uppercase">{order.seller.name}</p>
                          <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-2"><Mail className="w-3 h-3"/> {order.seller.email}</span>
                            <span className="flex items-center gap-2"><Phone className="w-3 h-3"/> {order.seller.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3"/> Delivery Address</p>
                          <p className="text-[10px] font-medium leading-relaxed italic">"{order.seller.address}"</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="bg-muted/30 p-4 border-y border-border flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleAction(order.id, "Mark as Shipped")}
                      className="bg-background border border-border px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Truck className="w-3.5 h-3.5" /> Mark as Shipped
                    </button>
                    <button 
                      onClick={() => handleAction(order.id, "Delayed Product")}
                      className="bg-background border border-border px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Timer className="w-3.5 h-3.5" /> Delayed Product
                    </button>
                    <button 
                      onClick={() => handleAction(order.id, "Product Damaged")}
                      className="bg-background border border-border px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Ban className="w-3.5 h-3.5" /> Product Damage
                    </button>
                  </div>

                  {/* Problem Submission Section */}
                  <div className="p-6 bg-muted/10">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="relative flex-1">
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="WRITE AND SUBMIT A PROBLEM WITH THIS ORDER..."
                          value={problemText[order.id] || ""}
                          onChange={(e) => setProblemText({...problemText, [order.id]: e.target.value})}
                          className="w-full bg-background border-border py-6 pl-12 text-[10px] font-bold uppercase tracking-widest"
                        />
                      </div>
                      <button 
                        onClick={() => submitProblem(order.id)}
                        className="bg-foreground text-background px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                      >
                        Submit Issue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}