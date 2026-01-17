"use client";

import React from 'react';
import Link from "next/link";
import { ChevronRight, ShoppingCart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  discount: string;
  img: string;
}

interface CategorySection {
  title: string;
  products: Product[];
}

interface CategoryDealsProps {
  categoryFilter?: string;
}

export function CategoryDeals({ categoryFilter }: CategoryDealsProps) {
  const categorySections: CategorySection[] = [
    {
      title: "Beauty Deals",
      products: [
        { id: 1, name: "Maybelline Fit Me Foundation", price: "12,500", oldPrice: "15,000", discount: "17", img: "https://i.postimg.cc/W4MwHJsq/Maybelline.jpg" },
        { id: 2, name: "Nivea Body Lotion 400ml", price: "4,800", oldPrice: "6,200", discount: "23", img: "https://i.postimg.cc/jdLQr1Rm/NIVEA.jpg" },
        { id: 3, name: "Garnier Micellar Water", price: "5,999", oldPrice: "7,800", discount: "23", img: "https://i.postimg.cc/qR1nPsSV/Garnier-Micellar.jpg" },
        { id: 4, name: "L'Oréal Paris Mascara", price: "8,200", oldPrice: "10,500", discount: "22", img: "https://i.postimg.cc/652RPG05/L-Oreal-Paris.jpg" },
        { id: 5, name: "Dove Soap Pack of 6", price: "3,200", oldPrice: "4,000", discount: "20", img: "https://i.postimg.cc/W4nJZm2r/Dove-Refreshing.jpg" },
        { id: 6, name: "Vaseline Petroleum Jelly", price: "2,100", oldPrice: "2,800", discount: "25", img: "https://i.postimg.cc/gjww1f3B/Vaseline.jpg" },
      ],
    },
    {
      title: "Phones Deals",
      products: [
        { id: 7, name: "Xiaomi Redmi A5 - 6.88\"", price: "153,956", oldPrice: "162,000", discount: "5", img: "https://i.postimg.cc/4NxZ4zMX/Smartphone-Xiaomi-Redmi.jpg" }, // Official render
        { id: 8, name: "Samsung Galaxy S24 Ultra", price: "1,250,000", oldPrice: "1,800,000", discount: "30", img: "https://i.postimg.cc/pdzMck95/Free-Samsung.jpg" },
        { id: 9, name: "Itel A100 6.75\" 90Hz", price: "98,000", oldPrice: "120,000", discount: "18", img: "https://i.postimg.cc/vHTFwGgD/sʿr-aytl-A100C-mmyzat-wʿywb-mwasfat-itel-A100C.jpg" },
        { id: 10, name: "Samsung Galaxy S23 FE", price: "850,700", oldPrice: "905,000", discount: "6", img: "https://i.postimg.cc/769cjRq2/Samsung-Galaxy.jpg" },
        { id: 11, name: "Redmi Note 13 Pro", price: "450,000", oldPrice: "489,000", discount: "8", img: "https://i.postimg.cc/jdm9VPYP/Smartphone-Celular-Xiaomi-Redmi-Note-13-Pro-5G-8GB-256GB-PRETO.jpg" },
        { id: 12, name: "Infinix Note 40", price: "320,000", oldPrice: "336,000", discount: "5", img: "https://i.postimg.cc/BbthkQhR/Smartphone.jpg" },
      ],
    },
    {
      title: "Appliances Deals",
      products: [
        { id: 13, name: "Aeon 1.5HP Split Inverter AC", price: "129,930", oldPrice: "168,700", discount: "23", img: "https://i.postimg.cc/pV94sqgh/ac.jpg" },
        { id: 14, name: "TropicWhirl Blender 2L", price: "21,999", oldPrice: "26,500", discount: "17", img: "https://i.postimg.cc/hGyZrdsP/Blender.jpg" }, 
        { id: 15, name: "TropicVnirl Dry Iron 1000W", price: "5,999", oldPrice: "6,500", discount: "7", img: "https://i.postimg.cc/C5DvS6gZ/download.jpg" },
        { id: 16, name: "Cloudooon Dry Iron 1200W", price: "3,570", oldPrice: "3,800", discount: "7", img: "https://i.postimg.cc/7L6mfL4k/Hamilton.jpg" },
        { id: 17, name: "SOLITEC 19\" Standing Fan", price: "15,649", oldPrice: "16,400", discount: "5", img: "https://i.postimg.cc/7P7XCcFC/standing-fan.jpg" }, 
        { id: 18, name: "Washing Machine", price: "136,930", oldPrice: "273,860", discount: "50", img: "https://i.postimg.cc/DynQSzdz/Washing-Machine.jpg" },
      ],
    },
    {
      title: "Kids and Baby",
      products: [
        { id: 19, name: "Pampers Baby Diapers Size 4", price: "18,500", oldPrice: "22,000", discount: "16", img: "https://i.postimg.cc/FHZhhTrM/Pampers.jpg" },
        { id: 20, name: "Johnson's Baby Lotion 500ml", price: "6,200", oldPrice: "8,000", discount: "23", img: "https://i.postimg.cc/rF2TWBzh/bby-lotion.jpg" },
        { id: 21, name: "Fisher-Price Baby Rattle Set", price: "9,999", oldPrice: "12,500", discount: "20", img: "https://i.postimg.cc/8CcgNDnm/Fisher-Price.jpg" },
        { id: 22, name: "Huggies Wipes 80 Pack", price: "4,500", oldPrice: "6,000", discount: "25", img: "https://i.postimg.cc/L5zrNsnF/HUGGIES.jpg" },
        { id: 23, name: "Baby Walker with Music", price: "25,000", oldPrice: "32,000", discount: "22", img: "https://i.postimg.cc/VNdp2gdC/bby-drive.jpg" },
        { id: 24, name: "Chicco Feeding Bottle Set", price: "8,800", oldPrice: "11,000", discount: "20", img: "https://i.postimg.cc/SNk5mknN/Chicco-Well.jpg" },
      ],
    },
    {
      title: "Cool Wines",
      products: [
        { id: 25, name: "Four Cousins Sweet Red Wine 75cl", price: "6,500", oldPrice: "8,000", discount: "19", img: "https://i.postimg.cc/hj78dyGd/Kroger.jpg" },
        { id: 26, name: "Carlo Rossi Red Wine 75cl", price: "7,200", oldPrice: "9,000", discount: "20", img: "https://i.postimg.cc/fTs7VvQN/download.jpg" },
        { id: 27, name: "Don Simon Red Wine 1L", price: "5,800", oldPrice: "7,200", discount: "19", img: "https://i.postimg.cc/RZswb56W/Don-Simon.jpg" },
        { id: 28, name: "Martini Rosso Vermouth 1L", price: "9,500", oldPrice: "12,000", discount: "21", img: "https://i.postimg.cc/D0TGb7DR/Martini.jpg" },
        { id: 29, name: "Gordons Sparkling Red Wine 75cl", price: "6,900", oldPrice: "8,800", discount: "22", img: "https://i.postimg.cc/vZc4T1TQ/Top-Holiday.jpg" },
        { id: 30, name: "Chamdor Sparkling Red Grape 75cl", price: "5,200", oldPrice: "6,500", discount: "20", img: "https://i.postimg.cc/5t8NQ8V1/Welch-s-Sparkling.jpg" },
      ],
    },
    {
      title: "Fashion Deals",
      products: [
        { id: 31, name: "Vintage Denim Jacket", price: "28,500", oldPrice: "35,000", discount: "19", img: "https://i.postimg.cc/ZR3bz4Cw/Vintage-Men.jpg" },
        { id: 32, name: "Men's Strass Dollar Pendant Chain", price: "12,000", oldPrice: "15,000", discount: "20", img: "https://i.postimg.cc/2yGfC6mt/chain.jpg" },
        { id: 33, name: "Ninja Dragons Graphic Tee", price: "9,800", oldPrice: "12,000", discount: "18", img: "https://i.postimg.cc/52TW4Dcr/download.jpg" },
        { id: 34, name: "Cargo Pants Wide Leg", price: "22,000", oldPrice: "28,000", discount: "21", img: "https://i.postimg.cc/brNBHRcQ/Bold-Print-Workwear.jpg" },
        { id: 35, name: "Crop Hoodie Beige", price: "18,500", oldPrice: "23,000", discount: "20", img: "https://i.postimg.cc/Kv19GjZc/Cute-Bear.jpg" },
        { id: 36, name: "Nike Dunk Low Brown", price: "95,000", oldPrice: "120,000", discount: "21", img: "https://i.postimg.cc/rs3N0G8W/Nike-Dunk-Low.jpg" },
      ],
    },
    {
      title: "Men's Fashion",
      products: [
        { id: 37, name: "Slim Fit Chino Pants", price: "25,000", oldPrice: "32,000", discount: "22", img: "https://i.postimg.cc/3JfZzTpn/Chino-Charles.jpg" },
        { id: 38, name: "Casual Polo Shirt", price: "15,500", oldPrice: "19,000", discount: "18", img: "https://i.postimg.cc/xd2N4xx0/Camisa-Polo.jpg" },
        { id: 39, name: "Leather Belt Brown", price: "8,900", oldPrice: "11,000", discount: "19", img: "https://i.postimg.cc/t40ssvHR/Leather-Belt.jpg" },
        { id: 40, name: "Men's Sneakers White", price: "45,000", oldPrice: "58,000", discount: "22", img: "https://i.postimg.cc/qBSRFDqw/download.jpg" },
        { id: 41, name: "Graphic Hoodie Black", price: "22,000", oldPrice: "28,000", discount: "21", img: "https://i.postimg.cc/pTyWGKHd/Heren-Letter.jpg" },
        { id: 42, name: "Sunglasses Aviator", price: "14,500", oldPrice: "18,000", discount: "19", img: "https://i.postimg.cc/PJsqCNBV/Eyewear.jpg" },
      ],
    },
    {
      title: "Classic Style",
      products: [
        { id: 43, name: "Classic White Shirt", price: "18,000", oldPrice: "22,500", discount: "20", img: "https://i.postimg.cc/KcNksDBv/T-Shirt.jpg" },
        { id: 44, name: "Leather Wallet Brown", price: "9,500", oldPrice: "12,000", discount: "21", img: "https://i.postimg.cc/QtjNpv6W/wallet.jpg" },
        { id: 45, name: "Timeless Trench Coat", price: "65,000", oldPrice: "85,000", discount: "24", img: "https://i.postimg.cc/136yby21/jacket.jpg" },
        { id: 46, name: "Oxford Shoes Black", price: "42,000", oldPrice: "55,000", discount: "24", img: "https://i.postimg.cc/RhNBdmw3/Oxford-Shoes-Black.jpg" },
        { id: 47, name: "Classic Belt", price: "7,800", oldPrice: "10,000", discount: "22", img: "https://i.postimg.cc/4xCg6ryG/Custom-men-s-belt.jpg" },
        { id: 48, name: "Polo T-Shirt Pack", price: "20,000", oldPrice: "26,000", discount: "23", img: "https://i.postimg.cc/zBfZDNtt/Polo-T-Shirt-Pack.jpg" },
      ],
    },
    {
      title: "Accessories",
      products: [
        { id: 49, name: "Classic Wrist Watch", price: "35,000", oldPrice: "45,000", discount: "22", img: "https://i.postimg.cc/m2FxrB45/watch.jpg" },
        { id: 50, name: "Men’s Beaded Bracelet", price: "7,500", oldPrice: "10,000", discount: "25", img: "https://i.postimg.cc/JhdVnnsg/beads.jpg" },
        { id: 51, name: "Gold Plated Earrings", price: "12,000", oldPrice: "15,500", discount: "23", img: "https://i.postimg.cc/x120DcHY/ear-ring.jpg" },
        { id: 52, name: "Silver Chain Necklace", price: "18,000", oldPrice: "24,000", discount: "25", img: "https://i.postimg.cc/fT4smJ87/necklace.jpg" },
        { id: 53, name: "Leather Strap Watch", price: "28,500", oldPrice: "36,000", discount: "21", img: "https://i.postimg.cc/nzw5HwPH/watch-(2).jpg" },
        { id: 54, name: "Fashion Stud Earrings", price: "6,800", oldPrice: "9,000", discount: "24", img: "https://i.postimg.cc/sx7tw4TS/download.jpg" },
      ],
    },
    {
      title: "Tech Essentials",
      products: [
        { id: 55, name: "HP Pavilion Laptop 15\"", price: "420,000", oldPrice: "480,000", discount: "13", img: "https://i.postimg.cc/jqnwRnWJ/HP-Pavilion.jpg" },
        { id: 56, name: "Dell Inspiron 14 Laptop", price: "395,000", oldPrice: "450,000", discount: "12", img: "https://i.postimg.cc/d3GVrddX/Hp-ENVY.jpg" },
        { id: 57, name: "Wireless Ear Pods Pro", price: "28,000", oldPrice: "35,000", discount: "20", img: "https://i.postimg.cc/cCGsxHj7/download.jpg" },
        { id: 58, name: "Bluetooth Ear Pods", price: "18,500", oldPrice: "24,000", discount: "23", img: "https://i.postimg.cc/52sNBfYc/Noise-Buds.jpg" },
        { id: 59, name: "Noise-Cancelling Headset", price: "32,000", oldPrice: "40,000", discount: "20", img: "https://i.postimg.cc/yNJB0cCS/P9-Wireless.jpg" },
        { id: 60, name: "Gaming Headset with Mic", price: "45,000", oldPrice: "58,000", discount: "22", img: "https://i.postimg.cc/4dkCt05f/Gaming-Headset-with-Mic.jpg" },
      ],
    },
  ];

  // Filter sections if categoryFilter is provided
  const filteredSections = categoryFilter
    ? categorySections.filter(section => 
        section.title.toLowerCase() === categoryFilter.toLowerCase()
      )
    : categorySections;

  // If no sections match the filter, show a message
  if (filteredSections.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">No products found in this category</h2>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {filteredSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="w-full rounded-lg overflow-hidden border border-border shadow-sm">
          {/* Orange Header Bar */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <h3 className="text-primary-foreground font-bold text-lg md:text-xl tracking-tight uppercase italic">
              {section.title}
            </h3>
            {!categoryFilter && (
              <Link 
                href={`/landing-page/products-details/[slug]`} 
                as={`/landing-page/products-details/${encodeURIComponent(section.title.toLowerCase().replace(/\s+/g, '-'))}`} 
                className="text-primary-foreground hover:underline flex items-center"
              >
                See all <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Product Grid */}
          <div className="bg-card p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {section.products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group block bg-background border border-transparent hover:border-primary/20 hover:shadow-md transition-all p-2 rounded-md"
              >
                <div className="relative aspect-square mb-2 bg-muted rounded overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Discount Badge */}
                  <div className="absolute top-1 right-1 bg-orange-100 text-[#f65d21] text-[10px] font-bold px-1 rounded border border-orange-200">
                    -{product.discount}%
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[13px] font-medium line-clamp-2 leading-snug min-h-[34px]">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base font-bold">₦ {product.price}</span>
                    <span className="text-[11px] text-muted-foreground line-through">₦ {product.oldPrice}</span>
                  </div>
                  <button 
                    className="w-full mt-2 py-1.5 cursor-pointer px-2 bg-primary text-primary-foreground text-xs font-medium rounded-md flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Add to cart functionality will go here
                      console.log('Added to cart:', product.id);
                    }}
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}