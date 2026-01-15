"use client";

import { useState } from "react";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Ticket,
  Truck,
  RefreshCcw,
  Package,
  Zap,
  Store,
  Globe,
  User,
  Plus,
  Minus,
  Mail,
  MessageSquare,
  PhoneCall,
} from "lucide-react";
import { PopularCategories } from "@/components/landing-page/PopularCategories";

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState("Shopdotfun Global");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const faqData: Record<string, { q: string; a: string }[]> = {
    Payments: [
      {
        q: "What payment methods are accepted?",
        a: "At Shopdotfun, we make paying easy and flexible for every Nigerian shopper in 2026. We accept all major debit cards (Visa, Mastercard, Verve), direct bank transfers from most Nigerian banks, secure USSD (*737#, *901#, etc.), and the fastest-growing option: digital wallets like OPay, PalmPay, Paga, and more. Cash on Delivery (COD) remains widely available across major cities and many secondary locations — just look for the 'Pay on Delivery' badge. For added convenience, we now support Buy Now, Pay Later (BNPL) partnerships with trusted providers like CredPal and others, letting you spread payments over time on eligible items. All transactions go through our PCI-DSS compliant, escrow-protected gateway for maximum security.",
      },
      {
        q: "Is it safe to use my card or wallet on Shopdotfun?",
        a: "Yes — 100% safe and secure. We use 256-bit SSL encryption for every page and transaction, plus advanced fraud detection powered by AI. Our payment partners are fully PCI-DSS Level 1 certified, and we never store your full card or wallet details on our servers — everything is tokenized. We also support 3D Secure (Verified by Visa / Mastercard SecureCode) where available. In 2026, with rising cyber threats, we conduct regular security audits and partner only with reputable Nigerian and international processors. Millions of transactions happen safely on Shopdotfun every month — your peace of mind is our priority.",
      },
      {
        q: "Why was my payment declined?",
        a: "Declines are usually on your bank's side, not ours. Common reasons in Nigeria include: insufficient balance, card not activated for online/international transactions (many banks require this), daily spending limits exceeded, expired card details, wrong CVV/expiry, or your bank temporarily blocking the transaction for suspected fraud (especially first-time e-commerce use). Some banks still restrict certain online merchants. Try these fixes: contact your bank to enable online payments, use USSD/wallet/COD instead, or try a different card. If the issue persists, share your order number with support — we'll help guide you through alternatives.",
      },
      {
        q: "Can I pay using USSD, mobile money, or digital wallets?",
        a: "Definitely! USSD is super popular and instant — select it at checkout, dial the code for your bank, and approve. Digital wallets (OPay, PalmPay, Paga, etc.) are exploding in 2026 and offer zero fees on many transfers, instant confirmation, and extra cashback rewards. These options are especially great for unbanked or card-less users. The process is encrypted end-to-end, and funds are held securely in escrow until you receive and approve your order. It's one of the safest and fastest ways to shop online in Nigeria today.",
      },
      {
        q: "Do you offer Buy Now, Pay Later (BNPL)?",
        a: "Yes! Following 2025-2026 trends, Shopdotfun partners with leading BNPL providers (CredPal, Easybuy, and similar services) to let you split payments into affordable installments on thousands of eligible products — from phones and laptops to fashion and appliances. At checkout, choose the BNPL option, complete a quick approval (usually instant), and enjoy your items now while paying over 3-12 months. Interest rates are transparent and often lower than traditional credit. Perfect for managing cash flow in tough economic times!",
      },
      {
        q: "Is Cash on Delivery still available everywhere?",
        a: "COD is still a core option and trusted by millions of Nigerians. It's available on most local items in Lagos, Abuja, Port Harcourt, Ibadan, Kano, and many secondary/rural cities via our expanded logistics partners. For high-value or international (Global) items, we may require pre-payment for security. A small handling fee sometimes applies to cover logistics. We recommend pre-paying when possible for faster processing, exclusive discounts, and to help us reduce cash-handling risks.",
      },
    ],

    Vouchers: [
      {
        q: "How do I use a voucher code?",
        a: "It's quick! On the checkout page, find the 'Apply Voucher/Promo Code' box under your order summary. Paste or type the code exactly (case-sensitive), hit 'Apply', and watch the discount instantly reduce your total — whether it's percentage off, fixed ₦ amount, free shipping, or category-specific. Vouchers come from email campaigns, social media, referrals, or special events like Black Friday. Always read the fine print for minimum order value, expiry date, or eligible products.",
      },
      {
        q: "Can I use multiple vouchers or combine with other offers?",
        a: "Usually, only one promotional voucher per order to keep things fair. However, you can often combine a voucher with wallet credits, loyalty points, free shipping offers, or BNPL in select campaigns. The system auto-detects compatible combinations — if it doesn't apply, the code may be single-use, expired, or restricted. During mega sales, we sometimes allow stacking — watch for announcements!",
      },
      {
        q: "Why isn't my voucher code working?",
        a: "Most common issues: code expired (many are time-limited), already redeemed (single-use), order below minimum spend, wrong category/brand, first-time-user only (if you've shopped before), or another discount already applied. Double-check spelling, expiry, and terms from the email/SMS/social post. If valid but still failing, contact support with the code and screenshot — our team can manually apply eligible ones or issue a replacement.",
      },
      {
        q: "Where can I find new voucher codes and promotions?",
        a: "Follow us on X (@ShopdotfunNG), Instagram, and WhatsApp channels for flash deals. Subscribe to our newsletter for exclusive codes. We run weekly giveaways, referral bonuses (₦500-₦2000 credit), and seasonal sales (Black Friday, Easter, Eid, Christmas) with huge discounts. Also check the 'Deals' and 'Flash Sales' sections on the app/site daily!",
      },
    ],

    Delivery: [
      {
        q: "How long does delivery take in 2026?",
        a: "We continue improving logistics for faster reach. Standard local delivery: 1-3 business days in Lagos, Abuja, PH; 3-7 days to other states and secondary cities. Shopdotfun Express (orange badge items from our warehouses): next-day or 48 hours in major areas. Rural and remote deliveries now average 5-10 days thanks to more pickup stations and partners. Global/International items: 10-25 business days (including customs). Real-time tracking via app/email + proactive notifications keep you updated. Delays may occur during peak seasons, strikes, or weather — we always communicate early.",
      },
      {
        q: "Can I change or update my delivery address?",
        a: "Yes — as long as the order hasn't entered 'Preparing' or 'Shipped' status. Go to My Orders → select the order → 'Edit Address' or contact support immediately via live chat with your order ID. Once in transit, changes are usually impossible for security/logistics reasons. Double-check your address, phone, and landmark at checkout to prevent issues.",
      },
      {
        q: "What if I'm not available during delivery?",
        a: "Our partners attempt delivery 2-3 times and usually call/message first. If missed, they may leave with a neighbor (your approval), redirect to a nearby pickup station, or reschedule. For COD, payment happens only on successful handover. Repeated failed attempts may return the package, with possible restocking fees. Add detailed instructions (gate code, best time, alternate contact) at checkout for smoother service.",
      },
      {
        q: "Do you deliver on weekends, public holidays, or to rural areas?",
        a: "Standard deliveries run Monday-Saturday (excluding holidays). Express in select cities may include Sundays. During major holidays (Christmas, Eid, etc.), we pause or slow down — advance notices sent via email/app. Rural delivery has improved dramatically in 2026 with more stations and partners — over 50% of orders now reach secondary cities quickly. Use the delivery estimator on product pages for your exact location.",
      },
    ],

    "Returns & Refunds": [
      {
        q: "What is the return policy at Shopdotfun?",
        a: "We offer a generous 7-day return window for most items (starting from delivery date). Return if defective, damaged, wrong item/size/color, or not as described. Items must be unused, in original packaging with tags/accessories intact. Non-returnable categories (hygiene items, perishables, personalized goods) are clearly labeled. Marketplace sellers follow similar rules, with Shopdotfun overseeing disputes for fairness. Start returns via My Orders → 'Return/Refund' — easy and guided.",
      },
      {
        q: "How long do refunds take after return?",
        a: "Once we receive and inspect the item (1-3 days typical), refunds process within 3-7 business days. Card/Bank refunds take 5-14 days depending on your bank; wallet credits are instant. COD returns go to wallet or bank transfer. We notify you at every step. For partial issues (missing parts), we issue quick partial refunds. Customer protection is strong — if seller disputes, we side with evidence.",
      },
      {
        q: "Who covers return shipping costs?",
        a: "Our error (wrong/damaged/defective/counterfeit) = free return. We provide prepaid label or arrange pickup. For 'change of mind', customer pays return shipping (use tracked service). We recommend keeping proof until refund confirms. In 2026, more sellers offer free returns on select items — check product pages!",
      },
    ],

    Products: [
      {
        q: "Are all products on Shopdotfun original and authentic?",
        a: "We enforce a strict zero-tolerance policy against counterfeits. All featured sellers are vetted, many are official brand stores/distributors. Products often include manufacturer warranties. Marketplace items undergo quality checks; if you receive suspected fake goods, report immediately — full refund + investigation. In 2026, we strengthened AI scanning and seller penalties to protect you.",
      },
      {
        q: "How do I check if an item is in stock?",
        a: "Real-time stock shown on product pages: 'In Stock', 'Low Stock (X left)', or 'Out of Stock'. If add-to-cart works, it's available. Popular items sell out fast — buy quickly! Join waitlist for notifications when restocked.",
      },
    ],

    "Shopdotfun Express": [
      {
        q: "What is Shopdotfun Express?",
        a: "Our premium fast-delivery service for items stored in local warehouses. Expect same-day/next-day in major cities, 1-3 days elsewhere. Prioritized packing and dedicated logistics make it our fastest option.",
      },
    ],

    "Sell on Shopdotfun": [
      {
        q: "How do I become a vendor/seller?",
        a: "Easy! Click 'Sell on Shopdotfun' → fill registration (business details, ID, bank info) → onboarding team reviews within 48-72 hours. Free to join, only commission on sales (category-based, competitive rates).",
      },
    ],
    "Shopdotfun Global": [
      {
        q: "What is Shopdotfun Global?",
        a: "Shopdotfun Global allows you to order products from international sellers across the world, delivered straight to your door in Nigeria.",
      },
      {
        q: "Do I pay extra for customs?",
        a: "The price shown at checkout for Global items typically includes international shipping and basic customs fees unless stated otherwise.",
      },
      {
        q: "Can I pay on delivery for global items?",
        a: "To ensure international shipping security, Global items require pre-payment via our secure automated gateway.",
      },
    ],
    Account: [
      {
        q: "How do I reset my password?",
        a: "Click on 'Forgot Password' on the login page and follow the instructions sent to your registered email address.",
      },
      {
        q: "How do I deactivate my account?",
        a: "You can request account deactivation by contacting our privacy team at compliance@shopdotfun.com.",
      },
    ],
  };

  // Get FAQs for the current tab or default to an empty array
  const currentFaqs = faqData[activeTab] || [];

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
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-2">
            <div className="bg-card border border-border rounded-3xl p-4 shadow-sm sticky top-32">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-4 px-4">
                Categories
              </p>
              {sidebarItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setOpenFaq(0); // Reset accordion to first item on tab change
                  }}
                  className={`w-full flex items-center cursor-pointer justify-between p-4 rounded-2xl transition-all group ${
                    activeTab === item.name
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3 font-semibold">
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <Plus
                    className={`w-3 h-3 transition-transform ${
                      activeTab === item.name ? "rotate-45" : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden min-h-[500px]">
              {/* Dynamic Background Icon */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] -z-0">
                {sidebarItems.find((i) => i.name === activeTab)?.icon && (
                  <div className="scale-[8] rotate-12 origin-top-right">
                    {sidebarItems.find((i) => i.name === activeTab)?.icon}
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                <span className="w-2 h-8 bg-primary rounded-full" />
                {activeTab} Questions
              </h3>

              <div className="space-y-4 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentFaqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="border-b border-border last:border-0 pb-4"
                      >
                        <button
                          onClick={() =>
                            setOpenFaq(openFaq === idx ? null : idx)
                          }
                          className="w-full flex justify-between items-center py-4 text-left group"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                              {activeTab}
                            </span>
                            <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                              {faq.q}
                            </h4>
                          </div>
                          {openFaq === idx ? (
                            <Minus className="text-primary w-5 h-5" />
                          ) : (
                            <Plus className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                        {openFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-muted-foreground leading-relaxed pb-4 pr-8"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Contact Support Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ContactCard
                icon={<Mail />}
                title="Email Support"
                detail="help@shopdotfun.com"
              />
              <ContactCard
                icon={<MessageSquare />}
                title="Live Chat"
                detail="Available 24/7"
              />
              <ContactCard
                icon={<PhoneCall />}
                title="Call Us"
                detail="+234 800-SHOP-FUN"
              />
            </div>
          </div>
        </div>
      </section>

      <PopularCategories />
      <ThemeAndScroll />
      <Footer />
    </main>
  );
}

function ContactCard({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
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
