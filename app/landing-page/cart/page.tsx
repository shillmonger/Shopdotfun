"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
import Footer from "@/components/landing-page/Footer";
import { Trash2, Plus, Minus, CreditCard, Truck, Headphones } from "lucide-react";

export default function CaseStudies() {
  // Mock Cart Data based on your uploaded image
  const cartItems = [
    { id: 1, name: "Trendy Brown Coat", color: "Brown", size: "XXL", price: 75, quantity: 4, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=300&auto=format&fit=crop" },
    { id: 2, name: "Classy Light Coat", color: "Cream", size: "XXL", price: 165, quantity: 1, img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=300&auto=format&fit=crop" },
    { id: 3, name: "Light Brown Sweater", color: "Light Brown", size: "S", price: 63, quantity: 1, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=300&auto=format&fit=crop" },
    { id: 4, name: "Modern Brown Dress", color: "Brown", size: "S", price: 90, quantity: 2, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300&auto=format&fit=crop" },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('https://i.postimg.cc/bYHpZSVm/download-(4).jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-white"
          >
            #MY CART
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg md:text-xl font-light tracking-wide opacity-90 max-w-2xl mx-auto"
          >
       Review your selected items and proceed to checkout to enjoy our seamless, premium delivery experience.
          </motion.p>
        </div>
      </section>

      {/* Cart Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Table Container */}
          <div className="lg:col-span-2 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-primary/10 border-b border-primary/20">
                  <th className="p-4 font-black uppercase italic tracking-tighter text-primary">Product</th>
                  <th className="p-4 font-black uppercase italic tracking-tighter text-primary">Price</th>
                  <th className="p-4 font-black uppercase italic tracking-tighter text-primary text-center">Quantity</th>
                  <th className="p-4 font-black uppercase italic tracking-tighter text-primary">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="p-4 flex items-center gap-4">
                      <button className="text-muted-foreground cursor-pointer hover:text-destructive transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <div className="w-20 h-24 bg-muted rounded-lg overflow-hidden relative">
                        <img src={item.img} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm md:text-base">{item.name}</h4>
                        <p className="text-xs text-muted-foreground italic">Color: {item.color} | Size: {item.size}</p>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-primary">${item.price.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3 border border-border rounded-lg p-2 w-max mx-auto">
                        <button className="hover:text-primary"><Minus size={14} /></button>
                        <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                        <button className="hover:text-primary"><Plus size={14} /></button>
                      </div>
                    </td>
                    <td className="p-4 font-black italic tracking-tighter">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center">
  <div className="flex gap-2 w-full md:w-auto">
    <input 
      type="text" 
      placeholder="Coupon Code" 
      className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
    />
    <button className="bg-primary dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-bold uppercase tracking-tighter italic hover:bg-primary/90 dark:hover:bg-gray-200 whitespace-nowrap">
      Apply Coupon
    </button>
  </div>

  <button className="text-muted-foreground hover:text-primary font-bold text-sm underline underline-offset-4">
    Clear Shopping Cart
  </button>
</div>

          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary/30 border border-border rounded-[2rem] p-8 sticky top-24">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-4 mb-6">
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items</span>
                  <span className="font-bold text-foreground">8</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Sub Total</span>
                  <span className="font-bold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-bold text-foreground">$00.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes</span>
                  <span className="font-bold text-foreground">$00.00</span>
                </div>
                <div className="flex justify-between text-primary font-bold">
                  <span>Coupon Discount</span>
                  <span>-$100.00</span>
                </div>
                <div className="h-[1px] bg-border my-4" />
                <div className="flex justify-between text-xl font-black italic tracking-tighter">
                  <span>Total</span>
                  <span>${(subtotal - 100).toFixed(2)}</span>
                </div>
              </div>

              <button
  className="w-full bg-primary text-white dark:text-black py-4 rounded-xl font-black uppercase italic tracking-tighter text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
>
  Proceed to Checkout
</button>

            </div>
          </div>
        </div>

        {/* Features Row - From Image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 border-t border-border pt-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Truck />
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-tighter italic">Free Shipping</h5>
              <p className="text-sm text-muted-foreground">For orders above $180</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <CreditCard />
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-tighter italic">Flexible Payment</h5>
              <p className="text-sm text-muted-foreground">Multiple secure options</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Headphones />
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-tighter italic">24/7 Support</h5>
              <p className="text-sm text-muted-foreground">We support online all days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-24 w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center z-0"
          style={{
            backgroundImage: "url('https://i.postimg.cc/rmBg1phY/AMARO-Sale.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center text-white px-4 max-w-3xl"
        >
          <span className="font-bold tracking-widest uppercase text-sm mb-4 block">
            Join Our Network
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 leading-tight">
            Ready to expand <br /> your wardrobe?
          </h2>
          <p className="text-lg opacity-80 mb-10 font-light">
            Don&apos;t leave your cart lonely. Complete your purchase now and join our community of satisfied shoppers.
          </p>
          <Link href="/auth/login">
            <button className="bg-white text-black px-10 py-4 rounded-full cursor-pointer font-bold uppercase tracking-tighter hover:bg-primary hover:text-white transition-colors">
              Continue Shopping
            </button>
          </Link>
        </motion.div>
      </section>

      <div className="py-20">
        <PopularCategories />
      </div>

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}