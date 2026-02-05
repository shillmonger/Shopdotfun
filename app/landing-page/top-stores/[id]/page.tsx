"use client";

import { useState, use, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronRight,
  Package,
  Clock,
  CreditCard,
} from "lucide-react";
import Header from "@/components/landing-page/Header";
import Footer from "@/components/landing-page/Footer";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { convertToCrypto } from "@/lib/crypto-converter";

// Product type definition
interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  stock: number;
  shippingFee: number;
  images: Array<{
    url: string;
    thumbnailUrl?: string;
    publicId?: string;
  }>;
  category: string;
  averageRating: number;
  totalRatings: number;
  sellerName: string;
  sellerEmail: string;
  crypto: string;
  processingTime?: string;
  commissionFee?: number;
  productCode?: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  discount: number;
  averageRating: number;
  crypto: string;
  images: Array<{
    url: string;
    thumbnailUrl?: string;
  }>;
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cryptoPrices, setCryptoPrices] = useState<{ [key: string]: string }>(
    {},
  );
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (data.success) {
        const productData = data.data;
        setProduct(productData);

        // Convert price to crypto if needed
        if (productData.crypto && productData.crypto !== "USD") {
          const discountedPrice =
            productData.price * (1 - productData.discount / 100);
          const cryptoPrice = await convertToCrypto(
            discountedPrice,
            productData.crypto,
          );
          setCryptoPrices({ [productData._id]: cryptoPrice });
        }
      } else {
        console.error("Failed to fetch product:", data.error);
        toast.error("Failed to load product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(
        "/api/products/all?limit=10&sortBy=createdAt&sortOrder=desc",
      );
      const data = await response.json();

      if (data.success) {
        const filtered = data.data
          .filter((p: Product) => p._id !== id)
          .slice(0, 4);
        setRelatedProducts(filtered);

        // Convert prices to crypto for related products
        const priceConversions: { [key: string]: string } = {};
        for (const item of filtered) {
          if (item.crypto && item.crypto !== "USD") {
            const discountedPrice = item.price * (1 - item.discount / 100);
            const cryptoPrice = await convertToCrypto(
              discountedPrice,
              item.crypto,
            );
            priceConversions[item._id] = cryptoPrice;
          }
        }
        setCryptoPrices((prev) => ({ ...prev, ...priceConversions }));
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("Cannot add more. Product is out of stock!");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} units available in stock`);
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

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-[1480px] mx-auto pt-40 pb-24 px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-t-2 border-primary/30 animate-spin-reverse"></div>
            </div>
            <p className="mt-6 text-muted-foreground font-medium animate-pulse">
              Refining product details...
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-[1480px] mx-auto pt-40 pb-24 px-4">
          <div className="max-w-md mx-auto text-center py-12 px-6 rounded-3xl border bg-card/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Product not found
            </h2>
            <p className="text-muted-foreground mb-8 text-balance">
              The item you're looking for might have been moved or is no longer
              available.
            </p>
            <Link href="/landing-page/top-stores">
              <Button size="lg" className="rounded-full px-8">
                Return to Shop
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discount,
  );
  const imageUrl =
    product.images?.[selectedImage]?.url ||
    product.images?.[selectedImage]?.thumbnailUrl ||
    "/placeholder.png";

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-background selection:bg-primary/20">
      <Header />

      <div className="container max-w-[1300px] mx-auto pt-32 pb-24 px-4 sm:px-6">
        {/* Breadcrumb-style Navigation */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
          <Link
            href="/landing-page/top-stores"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Stores
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          <span className="text-muted-foreground/60 truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16">
          {/* Left Column: Media */}
          <div className="lg:col-span-7 space-y-6">
            <div className="group relative aspect-square overflow-hidden rounded-[2.5rem] bg-white dark:bg-secondary/20 border border-border/40 shadow-sm transition-all duration-500 hover:shadow-xl">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="px-4 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm border border-border/20">
                  {product.category}
                </span>
                {product.stock <= 5 && (
                  <span
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm border",
                      product.stock <= 0
                        ? "bg-red-500 text-white border-red-600"
                        : "bg-orange-500 text-white border-orange-600",
                    )}
                  >
                    {product.stock <= 0
                      ? "Out of Stock"
                      : `Only ${product.stock} Left`}
                  </span>
                )}
              </div>

              {product.discount > 0 && (
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground text-xs font-black px-4 py-2 rounded-2xl shadow-lg ring-4 ring-primary/10">
                  -{product.discount}% OFF
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, idx) => {
                  const thumbUrl =
                    image.url || image.thumbnailUrl || "/placeholder.png";
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        "relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                        selectedImage === idx
                          ? "border-primary ring-4 ring-primary/10 scale-95"
                          : "border-transparent grayscale-[0.5] hover:grayscale-0 hover:border-border",
                      )}
                    >
                      <img
                        src={thumbUrl}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Information */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 group cursor-pointer w-fit">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                    {product.sellerName.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    {product.sellerName}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.1]">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-bold text-sm text-primary">
                      {product.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="h-4 w-[1px] bg-border" />
                  <span className="text-muted-foreground text-sm font-medium">
                    {product.totalRatings || 0} reviews
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 py-6 border-y border-border/50">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {product.crypto &&
                    product.crypto !== "USD" &&
                    cryptoPrices[product._id]
                      ? cryptoPrices[product._id]
                      : `$${discountedPrice.toFixed(2)}`}
                  </span>
                  {product.discount > 0 && product.crypto === "USD" && (
                    <span className="text-lg text-muted-foreground/60 line-through font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.discount > 0 && product.crypto === "USD" && (
                  <div className="ml-auto px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg border border-green-500/20">
                    Save ${(product.price - discountedPrice).toFixed(2)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm">
                {[
                  {
                    label: "Availability",
                    value:
                      product.stock <= 0
                        ? "Out of Stock"
                        : `${product.stock} units`,
                    icon: Package,
                    color:
                      product.stock <= 5 ? "text-red-500" : "text-foreground",
                  },
                  {
                    label: "Delivery Fee",
                    value:
                      product.shippingFee === 0
                        ? "Free"
                        : `$${product.shippingFee.toFixed(2)}`,
                    icon: Truck,
                    color: "text-primary",
                  },
                  {
                    label: "Processing",
                    value: product.processingTime || "3-5 Days",
                    icon: Clock,
                  },
                  {
                    label: "Crypto Payment",
                    value: product.crypto,
                    icon: CreditCard,
                  },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-border/40 shadow-sm"
                  >
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <spec.icon className="w-4 h-4" />
                      <span>{spec.label}</span>
                    </div>
                    <span className={cn("font-bold", spec.color)}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  size="lg"
                  className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98]"
                >
                  <ShoppingCart className="w-5 h-5 mr-3" strokeWidth={2.5} />
                  {product.stock <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
                </Button>

                <p className="text-[11px] text-center text-muted-foreground font-medium uppercase tracking-widest">
                  Secure checkout powered by Blockchain
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: ShieldCheck, label: "Verified Seller" },
                  { icon: RefreshCw, label: "30-Day Return" },
                  { icon: Truck, label: "Eco Shipping" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/30 bg-muted/20"
                  >
                    <badge.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground text-center">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <div className="mt-20 max-w-3xl border-t border-border/50 pt-12">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              Description
              <div className="h-0.5 w-12 bg-primary rounded-full" />
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        {/* Recommended Items */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2 text-foreground dark:text-white">
                You Might Also Like
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {relatedProducts.map((item) => {
                const itemDiscountedPrice = calculateDiscountedPrice(
                  item.price,
                  item.discount,
                );
                const itemImageUrl =
                  item.images?.[0]?.url ||
                  item.images?.[0]?.thumbnailUrl ||
                  "/placeholder.png";

                return (
                  <Link
                    href={`/landing-page/top-stores/${item._id}`}
                    key={item._id}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[4/5] rounded-[1rem] overflow-hidden bg-white border border-border/40 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                      <img
                        src={itemImageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {item.discount > 0 && (
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                          -{item.discount}%
                        </div>
                      )}
                    </div>
                    <div className="mt-5 space-y-2 px-1">
                      <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-lg text-foreground">
                          {item.crypto &&
                          item.crypto !== "USD" &&
                          cryptoPrices[item._id]
                            ? cryptoPrices[item._id]
                            : `$${itemDiscountedPrice.toFixed(2)}`}
                        </p>
                        {item.discount > 0 && item.crypto === "USD" && (
                          <p className="text-xs text-muted-foreground/60 line-through">
                            ${item.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}
