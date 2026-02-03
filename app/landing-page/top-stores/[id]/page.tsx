"use client";

import { useState, use, useEffect } from "react";
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
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

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
        setProduct(data.data);
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
        // Filter out current product and limit to 4 related products
        const filtered = data.data
          .filter((p: Product) => p._id !== id)
          .slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Check if product is out of stock
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
        <div className="container max-w-[1480px] mx-auto pt-28 pb-24 px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading product...</p>
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
        <div className="container max-w-[1480px] mx-auto pt-28 pb-24 px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Link href="/landing-page/top-stores">
              <Button>Back to Products</Button>
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
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 selection:bg-primary/30">
      <Header />

      <div className="container max-w-[1400px] mx-auto pt-28 pb-24 px-4 sm:px-6 lg:px-8">
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
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-full">
                  {product.category}
                </span>
              </div>
              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-6 right-6 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                  -{product.discount}%
                </div>
              )}
              {/* Stock Badge */}
              {product.stock <= 5 && (
                <div className="absolute bottom-6 left-6 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                  {product.stock <= 0
                    ? "Out of Stock"
                    : `Only ${product.stock} left`}
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => {
                  const thumbUrl =
                    image.url || image.thumbnailUrl || "/placeholder.png";
                  return (
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

          {/* ── Info Section ── */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-lg text-xs uppercase tracking-widest border border-primary/20">
                Sold by {product.sellerName}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent leading-none">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.averageRating || 0) ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                    />
                  ))}
                  <span className="ml-2 font-bold text-sm">
                    {product.averageRating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
                  {product.totalRatings || 0} verified reviews
                </span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl sm:text-5xl font-black tracking-tighter text-primary">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <span className="text-2xl text-muted-foreground/40 line-through font-medium italic">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/20">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <span
                    className={`text-sm font-bold ${product.stock <= 5 ? "text-red-600" : "text-green-600"}`}
                  >
                    {product.stock <= 0
                      ? "Out of Stock"
                      : `${product.stock} units available`}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/20">
                  <span className="text-sm text-muted-foreground">
                    Shipping
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {product.shippingFee === 0
                      ? "Free Shipping"
                      : `$${product.shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/20">
                  <span className="text-sm text-muted-foreground">
                    Processing Time
                  </span>
                  <span className="text-sm font-bold">
                    {product.processingTime || "3-5 Days"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/20">
                  <span className="text-sm text-muted-foreground">
                    Product Code
                  </span>
                  <span className="text-sm font-bold">
                    {product.productCode || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/20">
                  <span className="text-sm text-muted-foreground">
                    Accepted Crypto
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {product.crypto}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
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
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="w-6 h-6 mr-3" strokeWidth={3} />
                  {product.stock <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
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
            {product.description && (
              <div className="space-y-6">
                <h3 className="text-xl font-black italic tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-8">
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Items */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="text-2xl font-black italic tracking-tighter text-center mb-10 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
              YOU MIGHT ALSO LIKE
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
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
                    className="group"
                  >
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-secondary shadow-lg transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl">
                      <img
                        src={itemImageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">
                          -{item.discount}%
                        </div>
                      )}
                    </div>
                    <div className="mt-6 space-y-1">
                      <h3 className="font-black italic text-sm uppercase tracking-tighter group-hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-xl text-primary">
                          ${itemDiscountedPrice.toFixed(2)}
                        </p>
                        {item.discount > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
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
