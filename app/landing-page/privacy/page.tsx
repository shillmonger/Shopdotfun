"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Eye, Database, Share2, 
  Lock, UserCheck, Cookie, Globe2 
} from "lucide-react";

export default function PrivacyPolicy() {
  const pathname = usePathname();
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeSection, setActiveSection] = useState<string>("about");

  const sections = [
    { id: "about", title: "1. About this Notice", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "who", title: "2. Who We Are", icon: <Globe2 className="w-4 h-4" /> },
    { id: "data", title: "3. Data We Collect", icon: <Database className="w-4 h-4" /> },
    { id: "usage", title: "4. How We Use Data", icon: <Eye className="w-4 h-4" /> },
    { id: "sharing", title: "5. Sharing Data", icon: <Share2 className="w-4 h-4" /> },
    { id: "security", title: "6. Data Security", icon: <Lock className="w-4 h-4" /> },
    { id: "rights", title: "7. Your Legal Rights", icon: <UserCheck className="w-4 h-4" /> },
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
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      {/* Hero Header */}
      <section className="pt-32 pb-12 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10 rounded-full" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent"
          >
            Privacy Notice
          </motion.h2>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            Your privacy is our priority. Learn how Shopdotfun collects, uses, and protects your personal data.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-24 flex flex-col lg:flex-row gap-12">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block w-72 sticky top-32 h-fit">
          <div className="bg-card border border-border rounded-3xl p-6 space-y-2 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 px-2">Privacy Sections</p>
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

        {/* Policy Content Area */}
        <div className="flex-1 max-w-3xl">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm relative">
            
            {/* Section 1: About */}
            <div id="about" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                1. About this Notice
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This Privacy Notice explains how **Shopdotfun** processes your personal data when you use our website, mobile apps, and services. It outlines our security measures and your rights regarding your data.
              </p>
            </div>

            {/* Section 2: Who We Are */}
            <div id="who" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                2. Who We Are
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Shopdotfun is a premier e-commerce platform connecting verified sellers with consumers. Our logistics and secure payment services facilitate seamless, protected transactions across the marketplace.
              </p>
            </div>

            {/* Section 3: Data Collection */}
            <div id="data" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                3. The Data We Collect
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  We collect personal data to provide tailored products, analyze our performance, and improve our services.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DataCategory 
                    title="Direct Information" 
                    items={["Contact Details", "Billing Address", "Identity Data", "Payment Info"]} 
                  />
                  <DataCategory 
                    title="Automated Data" 
                    items={["IP Address", "Device Unique IDs", "Browsing History", "Search Queries"]} 
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Usage */}
            <div id="usage" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                4. How We Use Data
              </h3>
              <ul className="grid grid-cols-1 gap-3">
                {[
                  "Registering and managing your account",
                  "Processing and delivering secure orders",
                  "Detecting and preventing marketplace fraud",
                  "Complying with legal and tax obligations"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground bg-secondary/50 p-4 rounded-xl border border-border/50">
                    <UserCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 6: Security */}
            <div id="security" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                5. Data Security
              </h3>
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                <p className="text-muted-foreground leading-relaxed italic">
                  "We have implemented advanced security measures to prevent your data from being accidentally lost, used, or accessed in an unauthorized way. Access is strictly limited to authorized employees and contractors with a business need to know."
                </p>
              </div>
            </div>

            {/* Section 7: Legal Rights */}
            <div id="rights" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                6. Your Legal Rights
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You have the right to access, correct, or erase your personal data at any time.
              </p>
              <div className="bg-secondary/30 p-6 rounded-[2rem] border border-border">
                <h4 className="font-bold mb-2">Request Data Erasure</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  To permanently delete your data and discontinue your relationship with Shopdotfun, please contact our compliance team.
                </p>
                <p className="text-primary font-bold">compliance@shopdotfun.com</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}

function DataCategory({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="p-5 bg-card border border-border rounded-2xl">
      <h4 className="font-bold mb-3 text-foreground flex items-center gap-2">
        <Cookie className="w-4 h-4 text-primary" />
        {title}
      </h4>
      <ul className="text-sm text-muted-foreground space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="w-1 h-1 bg-primary rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}