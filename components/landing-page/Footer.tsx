"use client";

import Link from "next/link";
import {
  Youtube,
  Twitter,
  Send,
  Instagram,
  ShoppingBag,
  Store,
  ShieldCheck,
  Truck,
  Scale
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const socialLinks = [
    { name: "YouTube", icon: <Youtube size={24} />, href: "#" },
    { name: "X (Twitter)", icon: <Twitter size={24} />, href: "#" },
    { name: "Telegram", icon: <Send size={24} />, href: "#" },
    { name: "Instagram", icon: <Instagram size={24} />, href: "#" },
  ];

  if (!mounted) return null;

  return (
    <footer className="bg-background border-t border-border text-foreground pb-15 pt-12 px-6 md:px-16 relative">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-24">
        
        {/* Logo + Marketplace Description */}
        <div className="flex flex-col space-y-6 md:col-span-4 lg:col-span-2">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl sm:text-4xl font-black uppercase italic tracking-wider hover:text-primary transition-colors bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                SHOPDOTFUN
              </span>
            </Link>
            <p className="mt-5 leading-relaxed text-muted-foreground max-w-sm">
              Shopdotfun is a multi-vendor marketplace [cite: 6] designed to operate 
              as a trusted middleman between buyers and sellers. 
              We facilitate secure transactions, verified listings, and 
              reliable order fulfillment[cite: 35, 71].
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-primary font-bold uppercase tracking-wider text-sm mb-4">
              Connect With Us
            </h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-3 bg-secondary/50 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm border border-border"
                  title={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Buyer Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
            For Buyers
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/auth/buyer/login" className="hover:text-primary transition-colors">Buyer Login</Link></li>
            <li><Link href="/auth/buyer/register" className="hover:text-primary transition-colors">Create Account</Link></li>
            <li><Link href="/policies/payment" className="hover:text-primary transition-colors">Payment Policy</Link></li>
            <li><Link href="/help" className="hover:text-primary transition-colors">Buyer Protection</Link></li>
          </ul>
        </div>

        {/* Seller Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent ">
           For Sellers
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/auth/seller/login" className="hover:text-primary transition-colors">Seller Login</Link></li>
            <li><Link href="/auth/seller/register" className="hover:text-primary transition-colors">Become a Seller</Link></li>
            <li><Link href="/policies/seller" className="hover:text-primary transition-colors">Seller Policy</Link></li>
            <li><Link href="/seller/guidelines" className="hover:text-primary transition-colors">Payout System</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">Support</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/help" className="hover:text-primary transition-colors">Help & FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-[1400px] mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-12">
        <div className="flex items-center gap-4 text-muted-foreground">
          <ShieldCheck className="text-primary" size={32} />
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase">Escrow Payments</h4>
            <p className="text-xs">The platform holds payment until delivery is confirmed.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Truck className="text-primary" size={32} />
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase">Verified Logistics</h4>
            <p className="text-xs">Sellers must provide valid tracking information[cite: 36].</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Scale className="text-primary" size={32} />
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase">Fair Resolution</h4>
            <p className="text-xs">Admin-mediated dispute and complaint resolution.</p>
          </div>
        </div>
      </div>

      {/* Marketplace Disclaimer & Compliance Section */}
      <div className="max-w-[1400px] mx-auto mt-16 space-y-8 text-[12px] leading-relaxed text-muted-foreground/70 border-t border-border pt-12">
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-bold text-foreground">DISCLAIMER:</span> Shopdotfun is a marketplace platform 
            facilitating transactions between independent sellers and buyers. While we monitor listings  
            and verify seller accounts, the platform is not the direct manufacturer of the goods listed. 
            All product warranties and guarantees are provided by the respective sellers.
          </p>

          <p className="text-sm">
            We provide an escrow-style payment system  to protect both parties, but users are 
            encouraged to conduct due diligence. Shopdotfun does not accept liability for any external 
            bank transfers made outside of our official payment gateway options.
          </p>
        </div>

        <div className="space-y-2 border-t border-border/20 pt-8">
          <p className="font-bold text-foreground uppercase tracking-widest text-[10px]">
            Corporate Compliance
          </p>
          <p className="text-sm">
            SHOPDOTFUN operates as a registered multi-vendor entity. We adhere to international 
            e-commerce standards, anti-fraud regulations, and digital marketplace laws. Our 
            administrator team monitors all orders and transactions to ensure a secure 
            environment. We maintain strict data privacy protocols in accordance with global 
            digital service regulations.
          </p>
        </div>
      </div>

      {/* Final Copyright */}
      <div className="max-w-[1400px] mx-auto border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>© {new Date().getFullYear()} SHOPDOTFUN — All rights reserved.</p>
          <div className="flex gap-4 text-[12px]">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">User Agreement</Link>
          </div>
        </div>
        <p className="italic text-xs text-center md:text-right max-w-md opacity-60">
          Individual seller stores on this platform are independent entities. Use of this 
          site constitutes acceptance of the Shopdotfun Marketplace Agreement.
        </p>
      </div>
    </footer>
  );
}