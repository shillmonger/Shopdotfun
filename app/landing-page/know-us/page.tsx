"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
import Footer from "@/components/landing-page/Footer";
import Image from "next/image";

export default function CaseStudies() {
  const stats = [
    { label: "Years of Trust", value: "02+" },
    { label: "Products Delivered", value: "1.3M+" },
    { label: "Active Vendors", value: "90k+" },
    { label: "Happy Customers", value: "1.5M+" },
  ];

  const whatWeDo = [
    { label: "Logistics Excellence", value: 95 },
    { label: "Customer Support", value: 90 },
    { label: "Secure Payments", value: 100 },
  ];

  return (
    <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage:
              "url('https://i.postimg.cc/TYLJNtJn/Taobao-Banner-Clothing-Background-Color-Warm-Flat-Background-Image-And-Wallpaper-for-Free-Downloa.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-white"
          >
            #ABOUT US
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-light tracking-wide opacity-90 max-w-2xl mx-auto"
          >
            Empowering commerce across the continent by connecting millions of
            buyers and sellers through technology.
          </motion.p>
        </div>
      </section>

      {/* About Us Content */}
      <section className="max-w-7xl mx-auto px-4 py-24 w-full space-y-32">
        {/* Top Section: Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square lg:aspect-video rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://i.postimg.cc/nhd7H72c/download.jpg"
              alt="Our Marketplace Team"
              className="object-cover w-full h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm">
              Our Story
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
              We Always Provide <br /> The Best Experience
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Started with a vision to make shopping accessible to everyone, we
              have grown into a leading e-commerce ecosystem. We focus on
              providing high-quality products, competitive pricing, and a
              seamless delivery network that reaches every doorstep.
            </p>
            <Link href="/landing-page/know-us">
              <button className="bg-primary text-primary-foreground cursor-pointer px-8 py-4 rounded-full font-bold uppercase tracking-tighter hover:scale-105 transition-transform">
                Contact Us
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Middle Section: What We Do & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8">
                What We Do
              </h3>
              <div className="space-y-8">
                {whatWeDo.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between font-bold uppercase text-sm">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 border border-border rounded-3xl text-center bg-card shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-black italic text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hire Us / Call to Action Section */}
      <section className="relative py-24 w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center z-0"
          style={{
            backgroundImage:
              "url('https://i.postimg.cc/y85dQTnp/download-(1).jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center text-white px-4 max-w-3xl"
        >
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            Join Our Network
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 leading-tight">
            We Are Always Ready To <br /> Grow Your Business
          </h2>
          <p className="text-lg opacity-80 mb-10 font-light">
            Whether you are a buyer looking for the best deals or a seller
            wanting to reach millions, our platform is built for your success.
          </p>
          <Link href="/auth/login">
            <button className="bg-white text-black px-10 py-4 rounded-full cursor-pointer font-bold uppercase tracking-tighter hover:bg-primary hover:text-white transition-colors">
              Get Started
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
