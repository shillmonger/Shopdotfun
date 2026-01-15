"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, FileText, Gavel, AlertCircle } from "lucide-react";

export default function TermsAndConditions() {
  const pathname = usePathname();
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeSection, setActiveSection] = useState<string>("introduction");

  const sections = [
    { id: "introduction", title: "1. Introduction", icon: <FileText className="w-4 h-4" /> },
    { id: "accounts", title: "2. User Accounts", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "marketplace", title: "3. Marketplace Rules", icon: <Scale className="w-4 h-4" /> },
    { id: "payments", title: "4. Escrow & Payments", icon: <AlertCircle className="w-4 h-4" /> },
    { id: "disputes", title: "5. Dispute Resolution", icon: <Gavel className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    // Set up scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return (
    <main className="bg-background text-foreground transition-colors duration-300">
      <Header />

      {/* Hero Header */}
      <section className="pt-32 pb-12 bg-background relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent"
          >
            Terms of Service
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            Last Updated: January 14, 2026. Please read these terms carefully before using Shopdotfun.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-24 flex flex-col lg:flex-row gap-12">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block w-72 sticky top-32 h-fit">
          <div className="bg-card border border-border rounded-3xl p-6 space-y-2 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 px-2">Table of Contents</p>
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setActiveSection(item.id);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${
                  activeSection === item.id
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {item.icon}
                {item.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Legal Text Content */}
        <div className="flex-1 max-w-3xl">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground max-w-none">
            
            <div id="introduction" className="scroll-mt-32 mb-12">
              <h3 className="text-2xl font-bold mb-4">1. Introduction</h3>
              <p className="leading-relaxed mb-4">
                Welcome to **Shopdotfun**. These Terms and Conditions govern your use of our multi-vendor marketplace platform. By accessing or using Shopdotfun, you agree to be bound by these terms. Shopdotfun acts as a trusted middleman and escrow facilitator between buyers and sellers.
              </p>
              <p className="leading-relaxed">
                We provide a secure environment where every transaction is monitored. Our goal is to ensure that buyers receive exactly what they paid for and sellers receive their funds promptly upon successful delivery.
              </p>
            </div>

            <div id="accounts" className="scroll-mt-32 mb-12">
              <h3 className="text-2xl font-bold mb-4">2. User Accounts</h3>
              <p className="leading-relaxed mb-4">
                To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>You must be at least 18 years old to use this service.</li>
                <li>You agree to provide accurate, current, and complete information during registration.</li>
                <li>Shopdotfun reserves the right to suspend accounts that provide false information or violate our safety guidelines.</li>
              </ul>
            </div>

            <div id="marketplace" className="scroll-mt-32 mb-12">
              <h3 className="text-2xl font-bold mb-4">3. Marketplace Rules</h3>
              <p className="leading-relaxed mb-4">
                Sellers are required to list products accurately. Prohibited items include illegal substances, counterfeit goods, and any items that violate intellectual property rights.
              </p>
              <p className="leading-relaxed">
                As a middleman, Shopdotfun reviews vendor performance. Sellers with consistently high ratings receive &quot;Verified&quot; status, while those with poor performance or fraudulent behavior are permanently banned.
              </p>
            </div>

            <div id="payments" className="scroll-mt-32 mb-12">
              <h3 className="text-2xl font-bold mb-4">4. Escrow & Payments</h3>
              <p className="leading-relaxed mb-4">
                Our security is powered by an automated escrow system. When a buyer makes a payment, the funds are held securely by Shopdotfun.
              </p>
              <blockquote className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-xl italic text-foreground">
                &quot;Funds are only released to the seller after the buyer confirms receipt and satisfaction with the product, or after the protection period expires without a dispute.&quot;
              </blockquote>
            </div>

            <div id="disputes" className="scroll-mt-32 mb-12">
              <h3 className="text-2xl font-bold mb-4">5. Dispute Resolution</h3>
              <p className="leading-relaxed mb-4">
                In the event of a disagreement, our dedicated dispute resolution team will act as a neutral arbiter. We review tracking information, product photos, and communication logs to make a fair decision.
              </p>
              <p className="leading-relaxed">
                Decisions made by the Shopdotfun arbitration team are final and binding within the platform&apos;s ecosystem.
              </p>
            </div>

          </div>

          {/* Accept/Decline Footer (Optional UX) */}
          <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-[2rem] text-center">
            <h4 className="font-bold mb-2">Have questions about these terms?</h4>
            <p className="text-sm text-muted-foreground mb-4">Our legal team is here to help clarify any section of our service agreement.</p>
            <button className="bg-primary text-primary-foreground px-8 py-3 cursor-pointer rounded-xl font-bold hover:scale-105 transition-transform">
              Contact Legal Support
            </button>
          </div>
        </div>
      </section>

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}