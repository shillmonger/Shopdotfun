"use client";

import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface Product {
  id: string;
  _id: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  img: string;
  stock: number;
  shippingFee: number;
  category: string;
  averageRating: number;
  totalRatings: number;
  sellerName: string;
  sellerEmail: string;
  crypto: string;
  images: Array<{
    url: string;
    thumbnailUrl?: string;
    publicId?: string;
  }>;
}

interface CategorySection {
  title: string;
  products: Product[];
}

interface CategoryDealsProps {
  categoryFilter?: string;
}

export function CategoryDeals({ categoryFilter }: CategoryDealsProps) {
  const [categorySections, setCategorySections] = useState<CategorySection[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategoryProducts();
  }, []);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products/by-category");
      const data = await response.json();

      if (data.success) {
        setCategorySections(data.data);
      } else {
        console.error("Failed to fetch products:", data.error);
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Filter sections if categoryFilter is provided
  const filteredSections = categoryFilter
    ? categorySections.filter(
        (section) =>
          section.title.toLowerCase() === categoryFilter.toLowerCase(),
      )
    : categorySections;

  // If loading, show loading state
  if (loading) {
    return (
      <div className="space-y-8 max-w-[1400px] mx-auto px-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  // If no sections match the filter, show a message
  if (filteredSections.length === 0) {
    return (
      <div className="text-center py-20 px-4 m-4 border-2 border-dashed border-border rounded-3xl bg-muted/30 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -z-10" />

        <div className="relative mb-6 group">
          <img
            src="https://i.postimg.cc/LXSKYHG4/empty-box-removebg-preview.png"
            alt="Empty Box"
            className="w-40 h-40 object-contain cursor-pointer grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary/20 blur-sm rounded-full" />
        </div>

        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
          No Products Found
        </h3>

        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-[250px] leading-relaxed">
          No products found in this category
        </p>

        <Link href="/">
              <button className="mt-8 bg-primary text-white dark:text-black px-8 py-3 rounded-xl font-bold uppercase tracking-tighter hover:bg-primary/90 transition-colors">
            Back to Home
          </button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = (product: Product) => {
    // Check if product is out of stock
    if (product.stock <= 0) {
      toast.error("Cannot add more. Product is out of stock!");
      return;
    }

    const productData = {
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      shippingFee: product.shippingFee,
      images: product.images,
      category: product.category,
      sellerName: product.sellerName,
      sellerEmail: product.sellerEmail,
      crypto: product.crypto,
    };

    addToCart(productData);
    toast.success("Product added to cart");
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
          Features Deals
        </h2>
        <p className="text-muted-foreground font-medium tracking-widest uppercase text-sm">
          Summer Collection New Modern Design
        </p>
      </div>

      {filteredSections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className="w-full rounded-lg overflow-hidden border border-border shadow-sm"
        >
          {/* Orange Header Bar */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <h3 className="text-primary-foreground font-bold text-lg md:text-xl tracking-tight uppercase italic">
              {section.title}
            </h3>
            {!categoryFilter && (
              <Link
                href={`/landing-page/products-details/[slug]`}
                as={`/landing-page/products-details/${encodeURIComponent(section.title.toLowerCase().replace(/\s+/g, "-"))}`}
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
                href={`/general-dashboard/buyer-dashboard/browse-product/${product.id}`}
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
                    <span className="text-base font-bold">
                      ₦ {product.price.toLocaleString()}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-[11px] text-muted-foreground line-through">
                        ₦ {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    className="w-full mt-2 py-1.5 cursor-pointer px-2 bg-primary text-primary-foreground text-xs font-medium rounded-md flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart size={14} />
                    {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
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
