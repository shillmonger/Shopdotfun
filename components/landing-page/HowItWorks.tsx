"use client";

import { motion } from "framer-motion";
import { cloneElement } from "react";
import { ShoppingCart, CreditCard, Truck, ShieldCheck, Coins, Smile } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const HowItWorks = () => {
  const steps = [
    { 
      title: "1. Add to Cart", 
      icon: <ShoppingCart />, 
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400", 
      desc: "Browse our verified marketplace and add your favorite products from top-rated vendors." 
    },
    { 
      title: "2. Make Payment", 
      icon: <CreditCard />, 
      img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=400", 
      desc: "Pay securely via our automated gateway. The platform holds your funds in escrow." 
    },
    { 
      title: "3. Product Shipment", 
      icon: <Truck />, 
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400", 
      desc: "The seller is notified immediately to process your order and provide tracking info." 
    },
    { 
      title: "4. Confirmation", 
      icon: <ShieldCheck />, 
      img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400", 
      desc: "Once you receive your item and confirm it matches, notify us via your dashboard." 
    },
    { 
      title: "5. Seller Gets Paid", 
      icon: <Coins />, 
      img: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=400", 
      desc: "After your confirmation, we release the funds to the seller. Secure and transparent." 
    },
    { 
      title: "6. Everybody is Happy", 
      icon: <Smile />, 
      img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400", 
      desc: "Leave a review! Our system ensures a high-quality experience and successful deals." 
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative max-w-[1400px] mx-auto px-4 lg:px-0 pb-20 w-full overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-0 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg md:text-xl">
          Shopdotfun acts as a <span className="text-primary font-bold">trusted middleman</span> to ensure every transaction
          is secure for both buyers and sellers. Here is our simple 6-step process.
        </p>
      </div>

      {/* Desktop / Tablet Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="group relative bg-card border border-border rounded-[2.5rem] p-8 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
          >
            {/* Large Background Number */}
            <span className="absolute -right-4 -top-8 text-[140px] font-black text-foreground/[0.03] italic group-hover:text-primary/[0.07] transition-colors duration-500">
              {i + 1}
            </span>

            <div className="relative z-10">
              {/* Image with Grayscale to Color effect */}
              <div className="mb-6 rounded-2xl overflow-hidden h-44 w-full relative">
                <img 
                  src={step.img} 
                  alt={step.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground p-3 rounded-xl shadow-xl">
                  {cloneElement(step.icon, { className: "w-6 h-6" })}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
            
            {/* Animated accent line */}
            <div className="absolute bottom-0 left-0 h-1.5 bg-primary w-0 group-hover:w-full transition-all duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel>
          <CarouselContent>
            {steps.map((step, i) => (
              <CarouselItem key={i} className="px-4">
                <div className="relative bg-card border border-border rounded-3xl p-6 overflow-hidden shadow-sm">
                  <span className="absolute -right-4 -top-8 text-[120px] font-black text-foreground/[0.03] italic">
                    {i + 1}
                  </span>
                  <div className="mb-6 rounded-2xl overflow-hidden h-44 w-full relative">
                    <img 
                      src={step.img} 
                      alt={step.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground p-3 rounded-xl shadow-xl">
                      {cloneElement(step.icon, { className: "w-6 h-6" })}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.desc}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-center gap-6">
            <CarouselPrevious className="static bg-primary/10 border-none hover:bg-primary hover:text-white" />
            <CarouselNext className="static bg-primary/10 border-none hover:bg-primary hover:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};
