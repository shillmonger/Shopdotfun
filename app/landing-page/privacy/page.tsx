"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
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

    window.addEventListener('scroll', handleScroll, { passive: true });
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
            Effective January 14, 2026. This notice outlines our commitment to the transparent processing of your personal data.
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
                This Privacy Notice provides mandatory information on how **Shopdotfun** collects and processes your personal data when you visit our website, mobile applications, or use our specialized escrow services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                It sets out our protocols for data retention, explains how we keep your information secure against unauthorized access, and details the legal rights you hold under applicable data protection legislation.
              </p>
            </div>

            {/* Section 2: Who We Are */}
            <div id="who" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                2. Who We Are
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Shopdotfun is a leading multi-vendor marketplace platform. Our ecosystem comprises a consumer marketplace, a coordinated logistics framework for secure shipment, and a proprietary escrow payment service designed to facilitate trust and financial security between participants.
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
                  We collect personal data to provide a tailored user experience and to analyze and continually optimize our marketplace performance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DataCategory 
                    title="Information You Provide" 
                    items={["Full Name & Identity Data", "Postal & Delivery Addresses", "Biometric Authentication", "Financial & Billing Data"]} 
                  />
                  <DataCategory 
                    title="Automated Technology" 
                    items={["Device Operating Systems", "IP & Browser Fingerprints", "Browsing & Purchase History", "Geographic Location Data"]} 
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Usage */}
            <div id="usage" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                4. How We Use Your Data
              </h3>
              <p className="text-muted-foreground mb-6">We only process data where we have a legal basis (Consent, Contract, or Legitimate Interest) for the following purposes:</p>
              <ul className="grid grid-cols-1 gap-3">
                {[
                  "Registering and authenticating your secure marketplace account",
                  "Processing transactions and managing the escrow release cycle",
                  "Performing due diligence and anti-fraud compliance checks",
                  "Recommending products based on your inferred personal preferences",
                  "Enabling interaction with third-party logistics and payment partners"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground bg-secondary/50 p-4 rounded-xl border border-border/50">
                    <UserCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 5: Sharing Data */}
            <div id="sharing" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                5. How We Share Data
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To fulfill our contract with you, we may share data with third-party service providers who perform functions on our behalf, including order fulfillment, package delivery, and payment processing. We require all third parties to respect the security of your personal data and to treat it in accordance with the law and our strict internal instructions.
              </p>
            </div>

            {/* Section 6: Security */}
            <div id="security" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                6. Data Security
              </h3>
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                <p className="text-muted-foreground leading-relaxed italic">
                  &quot;Shopdotfun has implemented industry-standard technical and organizational security measures to prevent your personal data from being accidentally lost, altered, or accessed in an unauthorized way. We strictly limit data access to employees and agents who have a professional &apos;need-to-know&apos; and are subject to a duty of confidentiality.&quot;
                </p>
              </div>
            </div>

            {/* Section 7: Legal Rights */}
            <div id="rights" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                7. Your Legal Rights
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to access, correct, or erase your information, or object to specific processing activities.
              </p>
              <div className="bg-secondary/30 p-6 rounded-[2rem] border border-border">
                <h4 className="font-bold mb-2">Data Protection Officer</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  If you wish to exercise your legal rights or permanently delete your account, please submit a formal request to our compliance department.
                </p>
                <p className="text-primary font-bold">compliance@shopdotfun.com</p>
              </div>
            </div>

          </div>
        </div>
      </section>


       {/* Popular Categories */}
                  <PopularCategories />


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