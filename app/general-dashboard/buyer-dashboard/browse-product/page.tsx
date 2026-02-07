"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  ChevronRight,
  FilterX,
  Loader2,
} from "lucide-react";
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

// Mock Data for the UI
const CATEGORIES = [
  "Supermarket",
  "Health & Beauty",
  "Home & Office",
  "Phones & Tablets",
  "Computing",
  "Electronics",
  "Fashion",
  "Baby Products",
  "Gaming",
  "Sporting Goods",
];

interface Product {
  _id: string;
  name: string;
  sellerName: string;
  price: number;
  discount: number;
  stock: number;
  shippingFee: number;
  crypto: string;
  images: Array<{
    url: string;
    thumbnailUrl: string;
    publicId: string;
  }>;
  category: string;
  averageRating?: number;
  totalRatings?: number;
  reviews?: Array<{
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

export default function BrowseProductsPage() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Product States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Rating states
  const [ratingLoading, setRatingLoading] = useState<string | null>(null);

  // Crypto prices state
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [cryptoLoading, setCryptoLoading] = useState(true);
  
  // Selected crypto state (from user preferences)
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");

  // Fetch crypto prices function
  const fetchCryptoPrices = async () => {
    try {
      setCryptoLoading(true);
      const response = await fetch('/api/coinmarketcap');
      const data = await response.json();
      
      if (response.ok) {
        // Extract prices from the response
        const prices: Record<string, number> = {};
        Object.keys(data).forEach(symbol => {
          prices[symbol] = data[symbol].quote.USD.price;
        });
        setCryptoPrices(prices);
      } else {
        console.error("Failed to fetch crypto prices:", data.error);
      }
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    } finally {
      setCryptoLoading(false);
    }
  };

  // Convert USD to crypto function
  const convertUsdToCrypto = (usdAmount: number, cryptoSymbol: string): string => {
    if (cryptoLoading) {
      return "Loading...";
    }
    
    if (!cryptoPrices[cryptoSymbol]) {
      return `${cryptoSymbol} N/A`;
    }
    
    const cryptoPrice = cryptoPrices[cryptoSymbol];
    const convertedAmount = usdAmount / cryptoPrice;
    
    // Format based on crypto value
    if (convertedAmount < 0.001) {
      return convertedAmount.toExponential(4) + ` ${cryptoSymbol}`;
    } else if (convertedAmount < 1) {
      return convertedAmount.toFixed(6) + ` ${cryptoSymbol}`;
    } else {
      return convertedAmount.toFixed(4) + ` ${cryptoSymbol}`;
    }
  };

  // Fetch products function
  const fetchProducts = async (pageNum = 1, append = false) => {
    const isInitialLoad = pageNum === 1 && !append;
    try {
      if (isInitialLoad) setLoading(true);
      if (append) setLoadingMore(true);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "20",
        ...(selectedCategory !== "All" && { category: selectedCategory }),
        ...(inStockOnly && { inStockOnly: "true" }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/buyer/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (append) {
          setProducts((prev) => [...prev, ...data.products]);
        } else {
          setProducts(data.products);
        }
        setHasMore(data.pagination.hasMore);
        setTotalProducts(data.pagination.total);
        setPage(pageNum);
      } else {
        console.error("Failed to fetch products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      if (isInitialLoad) setLoading(false);
      if (append) setLoadingMore(false);
    }
  };

  // Reset filters function
  const resetFilters = () => {
    setSelectedCategory("All");
    setInStockOnly(false);
    setSearchQuery("");
    setPage(1);
  };

  // Rating functionality
  const addRating = async (productId: string) => {
    if (!session?.user?.email) {
      toast.error('Please login to rate products');
      return;
    }

    setRatingLoading(productId);
    
    try {
      const response = await fetch('/api/buyer/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the product in the local state
        setProducts(prevProducts => 
          prevProducts.map(product => {
            if (product._id === productId) {
              const updatedProduct: Product = {
                ...product,
                averageRating: data.averageRating,
                totalRatings: data.totalRatings,
                reviews: [
                  ...(product.reviews || []),
                  {
                    userId: session.user.email || '',
                    userName: session.user.name || 'Anonymous',
                    rating: 1,
                    comment: 'User rated this product',
                    createdAt: new Date().toISOString()
                  }
                ]
              };
              return updatedProduct;
            }
            return product;
          })
        );
        
        toast.success('Rating added successfully!');
      } else {
        if (response.status === 400 && data.error === 'You have already rated this product') {
          toast.info('You have already rated this product');
        } else {
          toast.error(data.error || 'Failed to add rating');
        }
      }
    } catch (error) {
      console.error('Error adding rating:', error);
      toast.error('Failed to add rating');
    } finally {
      setRatingLoading(null);
    }
  };

  // Helper function to check if user has rated a product
  const hasUserRated = (product: Product) => {
    if (!session?.user?.email || !product.reviews) return false;
    return product.reviews.some(review => review.userId === session.user.email);
  };

  // Cart functionality
  const [cartLoading, setCartLoading] = useState<string | null>(null);

  const addToCart = async (product: Product) => {
    setCartLoading(product._id);
    
    try {
      const response = await fetch('/api/buyer/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if you have JWT token
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          productName: product.name,
          sellerName: product.sellerName,
          price: product.price,
          discount: product.discount,
          stock: product.stock,
          shippingFee: product.shippingFee || 0, // Add shipping fee from product
          image: product.images?.[0]?.url || '/placeholder-product.jpg',
          quantity: 1
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message or update UI
        toast.success('Product added to cart successfully!');
        // Dispatch cart update event to refresh header badge
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        if (response.status === 401) {
          toast.error('Please login to add items to cart');
        } else {
          toast.error(data.error || 'Failed to add product to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setCartLoading(null);
    }
  };

  // Load more products
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(page + 1, true);
    }
  };

  // Effects
  // Load crypto preference from localStorage on mount
  useEffect(() => {
    const savedCrypto = localStorage.getItem('selectedCrypto');
    if (savedCrypto) {
      setSelectedCrypto(savedCrypto);
    }
  }, []);

  // Listen for crypto changes from settings page
  useEffect(() => {
    const handleCryptoChange = (event: CustomEvent) => {
      setSelectedCrypto(event.detail.crypto);
    };

    window.addEventListener('cryptoChanged', handleCryptoChange as EventListener);
    
    return () => {
      window.removeEventListener('cryptoChanged', handleCryptoChange as EventListener);
    };
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts(1, false);
    fetchCryptoPrices();
  }, []);

  // Debounced filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (page === 1) {
        fetchProducts(1, false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, inStockOnly, searchQuery]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-10">
          {/* Search & Header Section */}
          <section className="p-4 md:p-8 bg-card border-b border-border">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-6">
                Explore Products
              </h1>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by product or seller name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none transition-all shadow-sm"
                  />
                </div>
                <button
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                  className="flex items-center justify-center cursor-pointer gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {isFilterVisible ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[60vh]">
            {/* B. Filters Sidebar */}
            {isFilterVisible && (
              <aside className="w-full lg:w-64 p-6 border-r border-border space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={`block w-full text-left px-3 py-2 cursor-pointer rounded-lg text-sm transition-colors ${selectedCategory === "All" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"}`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left px-3 py-2 cursor-pointer rounded-lg text-sm transition-colors ${selectedCategory === cat ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                    Availability
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <span className="text-sm group-hover:text-primary">
                      In Stock Only
                    </span>
                  </label>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center cursor-pointer gap-2 py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors"
                >
                  <FilterX className="w-3 h-3" /> Reset Filters
                </button>
              </aside>
            )}

            {/* C. Product Listing Grid */}
            <section className="flex-1 p-4 md:p-8">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Loading Catalog...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map((product) => {
    const finalPrice = product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

    return (
      <div
        key={product._id}
        // Added 'transform-gpu' and 'will-change-transform' to stop the shaking
        className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 flex flex-col transform-gpu will-change-transform"
      >
        {/* Product Image Container */}
        <div className="relative aspect-square bg-muted overflow-hidden isolate">
          <img
            src={product.images?.[0]?.url || "/placeholder-product.jpg"}
            alt={product.name}
            // Added transform-gpu here as well
            className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500 transform-gpu"
          />

          {/* Crypto Price Overlay - Improved stability */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md py-2 px-3 flex items-center justify-between translate-z-0">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
              {selectedCrypto} Price
            </span>
            <span className="text-[11px] font-mono font-black text-white tabular-nums">
              {convertUsdToCrypto(finalPrice, selectedCrypto)}
            </span>
          </div>

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-[12px] font-black uppercase tracking-tighter z-10">
              -{product.discount}%
            </div>
          )}

          {/* Star Rating - Added z-index and translate-z-0 for stability */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-background/90 backdrop-blur-md border border-border px-2.5 py-1 rounded-full shadow-sm translate-z-0">
            <button
              onClick={() => addRating(product._id)}
              disabled={ratingLoading === product._id || hasUserRated(product)}
              className={`transition-all active:scale-125 ${
                hasUserRated(product)
                  ? "cursor-default"
                  : "cursor-pointer hover:text-yellow-500"
              } ${ratingLoading === product._id ? "animate-pulse" : ""}`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  hasUserRated(product)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
            <span className="text-[10px] font-bold tabular-nums">
              {product.totalRatings || 0}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
              {product.sellerName}
            </p>
            <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
          </div>

          <div className="mb-2">
            <p className="text-xs text-muted-foreground">
              Stock: {product.stock} units
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                Price
              </p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-black italic tracking-tighter tabular-nums">
                  {convertUsdToCrypto(finalPrice, selectedCrypto)}
                </p>
                {product.discount > 0 && (
                  <p className="text-xs text-muted-foreground line-through tabular-nums">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0 || cartLoading === product._id}
              className={`p-3 rounded-xl transition-all shadow-lg shadow-primary/10 ${
                product.stock === 0 || cartLoading === product._id
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:scale-110 active:scale-95 cursor-pointer"
              }`}
            >
              {cartLoading === product._id ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>
              )}

              {/* Load More Products */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 border border-border cursor-pointer rounded-xl text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </button>
                </div>
              )}

              {/* No products message */}
              {!loading && products.length === 0 && (
                <div className="text-center py-20 px-4 border-2 border-dashed border-border rounded-3xl bg-muted/30 flex flex-col items-center justify-center relative overflow-hidden">
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
                    Zero Signal Found
                  </h3>

                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-[250px] leading-relaxed">
                    No products found matching your criteria. Try adjusting your
                    filters.
                  </p>

                  <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-4 bg-foreground cursor-pointer text-background text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors rounded-full">
                    Reset Search
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}
