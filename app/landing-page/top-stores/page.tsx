"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
import { ExternalLink, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

interface Product {
  _id: string;
  name: string;
  description: string;
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
}

export default function TopStoresPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/all?page=${currentPage}&limit=20&sortBy=createdAt&sortOrder=desc`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock!');
      return;
    }
    addToCart({ ...product });
    toast.success('Product added to cart');
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('https://i.postimg.cc/KjXqYt0f/b3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4"
          >
            #OUR TOP STORE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-sm md:text-lg font-light opacity-90"
          >
            Discover hand-picked premium products ensuring quality and security in every transaction.
          </motion.p>
        </div>
      </section>

      <section className="container max-w-[1400px] mx-auto py-12 md:py-20 px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {products.map((product) => {
                const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
                const imageUrl = product.images?.[0]?.url || '/placeholder.png';

                return (
                  <div 
                    key={product._id} 
                    className="relative group h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]"
                  >
                    {/* Background Image Layer */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    </div>

                    {/* Card Content Layer */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
                      
                      {/* Price Tag */}
                      <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <span className="font-bold text-xs">
                          ${discountedPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Title & Category */}
                      <div className="mb-2">
                        <h3 className="text-lg font-bold leading-tight mb-1 drop-shadow-lg line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-white/70 line-clamp-2 font-light">
                          {product.description || `Premium selection from ${product.sellerName}.`}
                        </p>
                      </div>

                      <div className="flex justify-between items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] uppercase tracking-widest font-bold">
                          {product.category}
                        </span>
                        {product.stock <= 5 && (
                          <span className="px-3 py-1 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full text-[9px] uppercase tracking-widest font-bold text-red-200">
                            {product.stock <= 0 ? 'Sold Out' : `Only ${product.stock} Left`}
                          </span>
                        )}
                      </div>

                      {/* Main Action Button - UPDATED Z-INDEX */}
                      <div className="flex gap-2">
  {/* ADD TO CART */}
  <button
    onClick={() => handleAddToCart(product)}
    disabled={product.stock <= 0}
    className="flex-1 py-3 bg-white cursor-pointer text-black font-bold rounded-xl hover:bg-opacity-90 transition-all active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed uppercase tracking-wider text-xs shadow-xl flex items-center justify-center gap-2"
  >
    <ShoppingCart className="w-4 h-4" />
    {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
  </button>

  {/* VIEW PRODUCT LINK */}
  <Link
    href={`/landing-page/top-stores/${product._id}`}
    className="w-12 flex items-center justify-center rounded-xl bg-white/90 text-black hover:bg-white transition-all active:scale-95 shadow-xl"
    aria-label="View product details"
  >
    <ExternalLink className="w-4 h-4" />
  </Link>
</div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full border border-border hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-bold uppercase tracking-widest">
                  Page {currentPage} of {pagination.pages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage === pagination.pages}
                  className="p-3 rounded-full border border-border hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
      
      <div className="mt-20">
        <PopularCategories />
      </div>

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}