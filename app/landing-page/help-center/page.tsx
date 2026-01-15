"use client";

import { useEffect, useState } from "react";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import { motion } from "framer-motion";
import { 
  CreditCard, Ticket, Truck, RefreshCcw, 
  Package, Zap, Store, Globe, User, Plus, Minus,
  Mail, MessageSquare, PhoneCall
} from "lucide-react";

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState("Shopdotfun Global");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Set the first FAQ to be open by default on client side
    setOpenFaq(0);
  }, []);

  const sidebarItems = [
    { name: "Payments", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Vouchers", icon: <Ticket className="w-5 h-5" /> },
    { name: "Delivery", icon: <Truck className="w-5 h-5" /> },
    { name: "Returns & Refunds", icon: <RefreshCcw className="w-5 h-5" /> },
    { name: "Products", icon: <Package className="w-5 h-5" /> },
    { name: "Shopdotfun Express", icon: <Zap className="w-5 h-5" /> },
    { name: "Sell on Shopdotfun", icon: <Store className="w-5 h-5" /> },
    { name: "Shopdotfun Global", icon: <Globe className="w-5 h-5" /> },
    { name: "Account", icon: <User className="w-5 h-5" /> },
  ];

  const faqs = [
    { q: "What is Shopdotfun Global?", a: "Shopdotfun Global allows you to order products from international sellers across the world, delivered straight to your door in Nigeria." },
    { q: "How can I track my order?", a: "You can track your order in real-time through your 'Orders' dashboard or by using the tracking number provided in your shipping email." },
    { q: "Can I pay on delivery for global items?", a: "To ensure international shipping security, Global items require pre-payment via our secure automated gateway." },
    { q: "What is the Nigeria Postal Service partnership?", a: "We partner with NIPOST to provide affordable pickup locations across all 36 states for specific eligible items." },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent"
          >
            How can we help you?
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Search for help topics, manage your orders, or learn how Shopdotfun 
            protects your transactions as your trusted middleman.
          </p>
        </div>
      </section>

      {/* Help Content Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Inspired by Image */}
          <aside className="w-full lg:w-72 space-y-2">
            <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
              {sidebarItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    activeTab === item.name 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3 font-semibold">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  <Plus className={`w-4 h-4 transition-transform ${activeTab === item.name ? "rotate-45" : ""}`} />
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] -z-0">
                <Globe className="w-64 h-64 rotate-12" />
              </div>
              
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                {activeTab} Questions
              </h3>

              <div className="space-y-4 relative z-10">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="border-b border-border last:border-0 pb-4"
                  >
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex justify-between items-center py-4 text-left group"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">{activeTab}</span>
                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{faq.q}</h4>
                      </div>
                      {openFaq === idx ? <Minus className="text-primary" /> : <Plus />}
                    </button>
                    {isClient && openFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="text-muted-foreground leading-relaxed pb-4"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support Section - "Contact just like in image" */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <ContactCard icon={<Mail />} title="Email Support" detail="help@shopdotfun.com" />
               <ContactCard icon={<MessageSquare />} title="Live Chat" detail="Available 24/7" />
               <ContactCard icon={<PhoneCall />} title="Call Us" detail="+234 800-SHOP-FUN" />
            </div>
          </div>
        </div>
      </section>

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}

function ContactCard({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: string }) {
  return (
    <div className="bg-card border border-border p-6 rounded-[2rem] hover:border-primary/50 transition-colors group cursor-pointer">
      <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-bold text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}