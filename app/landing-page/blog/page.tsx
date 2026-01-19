"use client";

import { motion } from "framer-motion";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
import Footer from "@/components/landing-page/Footer";
import Image from "next/image";

export default function CaseStudies() {
  return (
    <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('https://i.postimg.cc/9F8r621S/cart.jpg')",
          }}
        >
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
  className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-white"
          >
            #readmore
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-light tracking-wide opacity-90"
          >
            Read all case studies about our product
          </motion.p>
        </div>
      </section>



      {/* Blog/Case Study Content */}
      <section className="flex flex-col gap-20 max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="flex flex-col gap-20">
          {/* Article Item */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Large Date Background */}
            <div className="relative">
              <span className="text-[3rem] md:text-[5rem] font-bold text-muted-foreground/10 leading-none select-none absolute -top-1 md:-top-4 left-3 -z-0">
                13/01
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 md:pt-12">
              {/* Image Column */}
              <div className="lg:col-span-7 w-full overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {/* Using standard img tag for external URL, switch to Next/Image if domain is configured */}
                  <img
                    src="https://i.postimg.cc/nzxQ2kcB/Instagram.jpg"
                    alt="Cotton Jersey Zip-Up Hoodie"
                    className="object-cover w-full h-full hover:scale-105 rounded-lg transition-transform duration-700 ease-in-out"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-5 space-y-6 lg:pl-8">
                <h2 className="text-[20px] md:text-3xl font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                  The Cotton-Jersey Zip-Up Hoodie
                </h2>

                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Kickstarter man braid goderd coloring book. Raclette wintcoat
                  selfless yr wolf chartreuse hexagon irany, godard.
                </p>

                <div className="pt-2">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
                  >
                    Continue Reading
                    <span className="h-[2px] w-8 bg-foreground group-hover:bg-primary group-hover:w-12 transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-20">
          {/* Article Item */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Large Date Background */}
            <div className="relative">
              <span className="text-[3rem] md:text-[5rem] font-bold text-muted-foreground/10 leading-none select-none absolute -top-1 md:-top-4 left-3 -z-0">
                13/04
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 md:pt-12">
              {/* Image Column */}
              <div className="lg:col-span-7 w-full overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {/* Using standard img tag for external URL, switch to Next/Image if domain is configured */}
                  <img
                    src="https://i.postimg.cc/3R3FN7pT/Screenshot-2026-01-19-105139.jpg"
                    alt="Cotton Jersey Zip-Up Hoodie"
                    className="object-cover w-full h-full hover:scale-105 rounded-lg transition-transform duration-700 ease-in-out"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-5 space-y-6 lg:pl-8">
                <h2 className="text-[20px] md:text-3xl font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                  How to Style a Quiff
                </h2>

                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Kickstarter man braid goderd coloring book. Raclette wintcoat
                  selfless yr wolf chartreuse hexagon irany, godard
                </p>

                <div className="pt-2">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
                  >
                    Continue Reading
                    <span className="h-[2px] w-8 bg-foreground group-hover:bg-primary group-hover:w-12 transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

          <div className="flex flex-col gap-20">
          {/* Article Item */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Large Date Background */}
            <div className="relative">
              <span className="text-[3rem] md:text-[5rem] font-bold text-muted-foreground/10 leading-none select-none absolute -top-1 md:-top-4 left-3 -z-0">
                16/01
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 md:pt-12">
              {/* Image Column */}
              <div className="lg:col-span-7 w-full overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {/* Using standard img tag for external URL, switch to Next/Image if domain is configured */}
                  <img
                    src="https://i.postimg.cc/C515r6yj/MONOIC_CONCRETE_DREAMS_YA_DISPONIBLE_21_NEW_PIECES.jpg"
                    alt="Cotton Jersey Zip-Up Hoodie"
                    className="object-cover w-full h-full hover:scale-105 rounded-lg transition-transform duration-700 ease-in-out"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-5 space-y-6 lg:pl-8">
                <h2 className="text-[20px] md:text-3xl font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                  Must-have Skater Girl Items
                </h2>

                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Kickstarter man braid goderd coloring book. Raclette wintcoat
                  selfless yr wolf chartreuse hexagon irany, godard
                </p>

                <div className="pt-2">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
                  >
                    Continue Reading
                    <span className="h-[2px] w-8 bg-foreground group-hover:bg-primary group-hover:w-12 transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-20">
          {/* Article Item */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Large Date Background */}
            <div className="relative">
              <span className="text-[3rem] md:text-[5rem] font-bold text-muted-foreground/10 leading-none select-none absolute -top-1 md:-top-4 left-3 -z-0">
                12/01
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 md:pt-12">
              {/* Image Column */}
              <div className="lg:col-span-7 w-full overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {/* Using standard img tag for external URL, switch to Next/Image if domain is configured */}
                  <img
                    src="https://i.postimg.cc/8c9vRVFb/The-Evin-Edition-arrived-to-set-the-standard-If-you-re-not-in-it-you-re-out.jpg"
                    alt="Cotton Jersey Zip-Up Hoodie"
                    className="object-cover w-full h-full hover:scale-105 rounded-lg transition-transform duration-700 ease-in-out"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-5 space-y-6 lg:pl-8">
                <h2 className="text-[20px] md:text-3xl font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                  The Cotton-Jersey Zip-Up Noodie
                </h2>

                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Kickstarter man braid goderd coloring book. Raclette wintcoat
                  selfless yr wolf chartreuse hexagon irany, godard
                </p>

                <div className="pt-2">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
                  >
                    Continue Reading
                    <span className="h-[2px] w-8 bg-foreground group-hover:bg-primary group-hover:w-12 transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      
        <div className="flex flex-col gap-20">
          {/* Article Item */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Large Date Background */}
            <div className="relative">
              <span className="text-[3rem] md:text-[5rem] font-bold text-muted-foreground/10 leading-none select-none absolute -top-1 md:-top-4 left-3 -z-0">
                13/01
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 md:pt-12">
              {/* Image Column */}
              <div className="lg:col-span-7 w-full overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {/* Using standard img tag for external URL, switch to Next/Image if domain is configured */}
                  <img
                    src="https://i.postimg.cc/wMmMdRvz/download-(2).jpg"
                    alt="Cotton Jersey Zip-Up Hoodie"
                    className="object-cover w-full h-full hover:scale-105 rounded-lg transition-transform duration-700 ease-in-out"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-5 space-y-6 lg:pl-8">
                <h2 className="text-[20px] md:text-3xl font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                  AW20 Menswar Trends
                </h2>

                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Kickstarter man braid goderd coloring book. Raclette wintcoat
                  selfless yr wolf chartreuse hexagon irany, godard
                </p>

                <div className="pt-2">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
                  >
                    Continue Reading
                    <span className="h-[2px] w-8 bg-foreground group-hover:bg-primary group-hover:w-12 transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PopularCategories />
      <ThemeAndScroll />
      <Footer />
    </main>
  );
}
