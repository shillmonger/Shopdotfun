"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

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
        console.error('Failed to fetch products:', data.error);
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    // Check if product is out of stock
    if (product.stock <= 0) {
      toast.error('Cannot add more. Product is out of stock!');
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
      crypto: product.crypto
    };
    
    addToCart(productData);
    toast.success('Product added to cart');
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
{/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('https://i.postimg.cc/KjXqYt0f/b3.jpg')",
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
  #OUR TOP STORE
</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-light tracking-wide opacity-90"
          >
            Discover hand-picked premium products ensuring quality and security in every transaction.
          </motion.p>
        </div>
      </section>

      <section className="container max-w-[1400px] mx-auto pt-20 bg-background">

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <div className="w-full mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
              {products.map((product) => {
                const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
                const imageUrl = product.images?.[0]?.url || product.images?.[0]?.thumbnailUrl || '/placeholder.png';
                
                return (
                  <div key={product._id} className="group">
                    <Link 
                      href={`/landing-page/top-stores/${product._id}`}
                      className="block"
                    >
                      <div className="bg-card border border-border rounded-lg p-3 md:p-4 hover:shadow-xl transition-all group h-full">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary mb-3">
                          <img 
                            src={imageUrl} 
                            alt={product.name}
                            className="object-cover w-full h-full cursor-pointer group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Discount Badge */}
                          {product.discount > 0 && (
                            <div className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">
                              -{product.discount}%
                            </div>
                          )}
                          {/* Stock Badge */}
                          {product.stock <= 5 && (
                            <div className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                              {product.stock <= 0 ? 'Out of Stock' : `Only ${product.stock} left`}
                            </div>
                          )}
                        </div>

                        <div className="px-1">
                          <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">
                            {product.category}
                          </p>
                          <h3 className="font-semibold text-foreground text-sm md:text-base leading-tight mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex gap-0.5 mb-2">
  {[...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`w-3 h-3 md:w-4 md:h-4 ${
        i < Math.floor(product.averageRating || 0)
          ? "fill-yellow-400 text-yellow-400"
          : "text-muted-foreground/30 dark:text-muted-foreground/20"
      }`}
    />
  ))}

  {product.totalRatings > 0 && (
    <span className="text-xs text-muted-foreground ml-1">
      ({product.totalRatings})
    </span>
  )}
</div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                              <span className="text-lg md:text-xl font-black text-primary">
                                ${discountedPrice.toFixed(2)}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-xs text-muted-foreground line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <button 
                              className="p-2 md:p-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-lg transition-all cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={product.stock <= 0}
                            >
                              <ShoppingCart className="w-4 h-4 md:w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 mb-24">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all ${
                        currentPage === pageNum 
                          ? 'bg-primary text-white scale-110 shadow-lg' 
                          : 'bg-secondary text-muted-foreground hover:bg-primary/20'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage === pagination.pages}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        <PopularCategories />
      </section>

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}