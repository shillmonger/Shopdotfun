"use client";

import { useState, use } from "react";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RefreshCw,
} from "lucide-react";
import Header from "@/components/landing-page/Header";
import Footer from "@/components/landing-page/Footer";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Product type definition
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Cartoon Astronaut T-Shirts",
    brand: "adidas",
    price: 78,
    rating: 4,
    reviewCount: 128,
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    ],
    description:
      "The Gildan Ultra Cotton T-shirt is made from substantial 6.0 oz. per sq. yd. fabric constructed from 100% cotton, this classic fit preshrunk jersey knit provides unmatched comfort with each wear.",
    details: [
      "100% Cotton",
      "Fabric weight: 6.0 oz/yd²",
      "Pre-shrunk fabric",
      "Taped neck and shoulders",
      "Seamless double-needle collar",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  // ... rest of your products
];

const RELATED_PRODUCTS = [
  {
    id: 2,
    name: "Casual Linen Trousers",
    price: 89.99,
    rating: 5,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
  },
  {
    id: 3,
    name: "Floral Summer Shirt",
    price: 65,
    rating: 4,
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400",
  },
  {
    id: 4,
    name: "Oxford Button Down",
    price: 85,
    rating: 4,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=400",
  },
  {
    id: 5,
    name: "Classic Chino Shorts",
    price: 55,
    rating: 4,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
  },
];

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const product = PRODUCTS.find((p) => p.id === parseInt(id)) || PRODUCTS[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 selection:bg-primary/30">
      <Header />

      <div className="container max-w-[1480px] mx-auto pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <Link
          href="/landing-page/top-stores"
          className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all mb-10"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to collection</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-20">
          {/* ── Images Section ── */}
          <div className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-3xl bg-secondary/30 backdrop-blur-sm border border-border/50 shadow-2xl">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-full">
                  Premium Quality
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-2xl cursor-pointer overflow-hidden border-2 transition-all duration-300 
                    ${
                      selectedImage === idx
                        ? "border-primary scale-105 shadow-lg shadow-primary/20"
                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                    }`}
                >
                  <img
                    src={image}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Info Section ── */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-lg text-xs uppercase tracking-widest border border-primary/20">
                {product.brand}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent leading-none">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                    />
                  ))}
                  <span className="ml-2 font-bold text-sm">
                    {product.rating}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
                  {product.reviewCount} verified reviews
                </span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl sm:text-5xl font-black tracking-tighter text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-muted-foreground/40 line-through font-medium italic">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Size Picker */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm uppercase tracking-widest">
                  Select Size
                </h3>
                <span className="text-xs text-primary font-bold cursor-pointer hover:underline">
                  Size Guide
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      min-w-[64px] h-14 rounded-xl text-sm font-black transition-all cursor-pointer duration-300 border-2
                      ${
                        selectedSize === size
                          ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/30 scale-105"
                          : "bg-transparent border-border hover:border-primary/50 text-foreground"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Quantity */}
                <div className="flex justify-center sm:justify-start">
                  <div className="flex items-center border-2 border-border rounded-2xl bg-secondary/20 p-1 w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-background rounded-xl transition-all"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <div className="w-14 text-center font-black text-xl italic">
                      {quantity}
                    </div>

                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-background rounded-xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  size="lg"
                  className="
      w-full sm:flex-1
      h-14 text-lg font-black italic tracking-tight
      shadow-2xl shadow-primary/20 cursor-pointer
      hover:shadow-primary/40
      transition-all hover:-translate-y-1 active:translate-y-0
    "
                  onClick={() =>
                    console.log("Checkout:", { quantity, size: selectedSize })
                  }
                >
                  <ShoppingCart className="w-6 h-6 mr-3" strokeWidth={3} />
                  ADD TO CART
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-8 border-y border-border/40">
                {[
                  { icon: Truck, label: "Express Shipping" },
                  { icon: ShieldCheck, label: "Secure Payment" },
                  { icon: RefreshCw, label: "30-Day Returns" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <badge.icon className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground leading-tight">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Area */}
            <div className="space-y-6">
              <h3 className="text-xl font-black italic tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-8">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {product.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {product.details.map((detail, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm font-bold text-foreground/80"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Items */}
        <div className="mt-32">
          <h2 className="text-2xl font-black italic tracking-tighter text-center mb-10 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
            UPGRADE YOUR STYLE
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {RELATED_PRODUCTS.map((item) => (
              <Link
                href={`/landing-page/top-stores/${item.id}`}
                key={item.id}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-secondary shadow-lg transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-6 space-y-1">
                  <h3 className="font-black italic text-sm uppercase tracking-tighter group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="font-black text-xl text-primary">
                    ${item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}
