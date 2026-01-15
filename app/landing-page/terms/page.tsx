"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
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

    window.addEventListener('scroll', handleScroll, { passive: true });
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
                    ? 'bg-primary/10 text-primary  border-primary'
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
                1.1. **Shopdotfun** operates an e-commerce platform consisting of a website and mobile application (&quot;marketplace&quot;), together with supporting IT, logistics, and escrow payment infrastructure for the sale and purchase of consumer products and services.
              </p>
              <p className="leading-relaxed mb-4">
                1.2. These general terms and conditions shall govern your use of the marketplace and related services. By accessing or using our marketplace, you accept these terms in full. If you disagree with any part of these terms, you must immediately discontinue use of the platform.
              </p>
              <p className="leading-relaxed">
                1.3. Shopdotfun acts as a neutral facilitator and escrow provider. While we provide the framework for secure transactions, unless explicitly stated otherwise, Shopdotfun is not a party to the contract of sale between buyers and sellers, but rather ensures the integrity of the exchange process.
              </p>
            </div>

            <div id="accounts" className="scroll-mt-32 mb-12">
              <h3 className="text-2xl font-bold mb-4">2. User Accounts</h3>
              <p className="leading-relaxed mb-4">
                2.1. You may not register with our marketplace if you are under 18 years of age. By using the platform, you warrant and represent that you meet this age requirement.
              </p>
              <p className="leading-relaxed mb-4">
                2.2. Registered users are responsible for maintaining the absolute confidentiality of their account credentials. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                <li>Provide accurate, current, and complete information as prompted by the registration forms.</li>
                <li>Notify us in writing immediately if you become aware of any unauthorized use of your account or disclosure of your password.</li>
                <li>Accept full responsibility for all activities that occur under your account, regardless of whether such activities were authorized by you.</li>
              </ul>
              <p className="leading-relaxed">
                2.3. Shopdotfun reserves the right, in our sole discretion and without notice or explanation, to suspend or cancel your account, or edit your account details, particularly in cases of suspected fraudulent activity or breach of these terms.
              </p>
            </div>

            <div id="marketplace" className="scroll-mt-32 mb-12">
              <h3 className="text-2xl font-bold mb-4">3. Marketplace Rules</h3>
              <p className="leading-relaxed mb-4">
                3.1. Sellers are exclusively responsible for the accuracy, quality, and legality of the products listed. Every product listing must include all relevant taxes and comply with applicable laws in force.
              </p>
              <p className="leading-relaxed mb-4">
                3.2. Prohibited Content: You must not use the marketplace to list products that infringe upon third-party intellectual property rights, promote illegal substances, or depict gratuitous violence.
              </p>
              <p className="leading-relaxed">
                3.3. **Shopdotfun Protocol:** As a middleman service, we implement a &quot;Verified Vendor&quot; system. High-performing sellers are granted enhanced visibility, while vendors found to be engaging in deceptive practices, off-platform solicitation, or bait-and-switch tactics will face immediate and permanent exclusion from the ecosystem.
              </p>
            </div>

            <div id="payments" className="scroll-mt-32 mb-12">
              <h3 className="text-2xl font-bold mb-4">4. Escrow & Payments</h3>
              <p className="leading-relaxed mb-4">
                4.1. To ensure maximum security, Shopdotfun utilizes a proprietary automated escrow mechanism. Upon a buyer&apos;s confirmation of purchase, funds are debited and held in a secure, non-interest-bearing escrow account managed by Shopdotfun.
              </p>
              <blockquote className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-xl italic text-foreground mb-4">
                &quot;Payment is only released to the seller&apos;s wallet once the buyer formally confirms receipt of the product in the specified condition, or once the designated protection period elapses without the filing of a formal dispute.&quot;
              </blockquote>
              <p className="leading-relaxed">
                4.2. Users must make all payments through the provided marketplace interfaces. Any attempt to bypass the Shopdotfun escrow system by transacting directly between buyer and seller is a material breach of these terms and voids all buyer protection guarantees.
              </p>
            </div>

            <div id="disputes" className="scroll-mt-32 mb-12">
              <h3 className="text-2xl font-bold mb-4">5. Dispute Resolution</h3>
              <p className="leading-relaxed mb-4">
                5.1. In the event of a conflict between a buyer and seller, either party may initiate a &quot;Dispute&quot; within the protection window. Shopdotfun&apos;s specialized Arbitration Team will then intervene as a neutral third party.
              </p>
              <p className="leading-relaxed mb-4">
                5.2. Evidence-Based Review: Our resolution process involves a rigorous audit of on-platform communication logs, digital tracking data, and photographic evidence provided by both parties. 
              </p>
              <p className="leading-relaxed">
                5.3. Finality: You acknowledge and agree that the decisions rendered by the Shopdotfun arbitration team are final and binding. This includes the authority to issue full or partial refunds to the buyer or to release the held escrow funds to the seller based on the merits of the case.
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



         {/* Popular Categories */}
                    <PopularCategories />

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}