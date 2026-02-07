"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
import Footer from "@/components/landing-page/Footer";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Truck,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";
import { convertToCrypto } from "@/lib/crypto-converter";
import { useCrypto } from "@/contexts/CryptoContext";

interface CartItem {
  productId: string;
  productName: string;
  sellerName: string;
  price: number;
  discount: number;
  quantity: number;
  stock: number;
  shippingFee: number;
  image: string;
  addedAt: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cryptoPrices, setCryptoPrices] = useState<{[key: string]: string}>({});
  const { selectedCoin } = useCrypto();

  useEffect(() => {
    loadCartFromStorage();

    // Listen for storage events from other components
    const handleStorageChange = () => {
      loadCartFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [selectedCoin]);

  const loadCartFromStorage = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
      
      // Convert cart item prices to crypto
      convertCartPrices(cart);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const convertCartPrices = async (cart: CartItem[]) => {
    const priceConversions: {[key: string]: string} = {};
    
    for (const item of cart) {
      const discountedPrice = calculateDiscountedPrice(item.price, item.discount);
      const cryptoPrice = await convertToCrypto(discountedPrice, selectedCoin.symbol);
      priceConversions[item.productId] = cryptoPrice;
    }
    
    setCryptoPrices(priceConversions);
  };

  const updateCart = (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("storage"));
    // Dispatch custom event for same-window updates (header badge)
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId,
    );
    updateCart(updatedCart);
    toast.success("Product removed from cart");
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    // Find the item to check stock
    const item = cartItems.find((item) => item.productId === productId);
    if (item && newQuantity > item.stock) {
      toast.error(`Only ${item.stock} units available in stock`);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item,
    );
    updateCart(updatedCart);
    toast.success("Cart updated");
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    window.dispatchEvent(new Event("storage"));
    // Dispatch custom event for same-window updates (header badge)
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    toast.success("Cart cleared");
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = calculateDiscountedPrice(
        item.price,
        item.discount,
      );
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const calculateCryptoSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (cryptoPrices[item.productId]) {
        const cryptoAmount = parseFloat(cryptoPrices[item.productId].split(' ')[0]);
        return total + (cryptoAmount * item.quantity);
      }
      return total;
    }, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotalShipping = () => {
    return cartItems.reduce(
      (total, item) => total + item.shippingFee * item.quantity,
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const cryptoSubtotal = calculateCryptoSubtotal();
  const totalItems = calculateTotalItems();
  const shipping = calculateTotalShipping();
  const taxes = 0; // You can calculate this based on your business logic
  const couponDiscount = 0; // Default to 0 when no coupon is applied
  const total = Math.max(0, subtotal + shipping + taxes - couponDiscount);
  const cryptoTotal = cryptoSubtotal > 0 ? cryptoSubtotal : null;

  if (loading) {
    return (
      <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-secondary/30 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-secondary/30 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage:
              "url('https://i.postimg.cc/bYHpZSVm/download-(4).jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-white"
          >
            #MY CART
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg md:text-xl font-light tracking-wide opacity-90 max-w-2xl mx-auto"
          >
            Review your selected items and proceed to checkout to enjoy our
            seamless, premium delivery experience.
          </motion.p>
        </div>
      </section>

      {/* Cart Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 w-full">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 px-4 border-2 border-dashed border-border rounded-3xl bg-muted/30 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -z-10" />

            <div className="relative mb-6 group">
              <img
                src="https://i.postimg.cc/zDnhMkn7/Shopping-removebg-preview.png"
                alt="Empty Box"
                className="
    w-40 h-40
    lg:w-60 lg:h-60
    object-contain cursor-pointer
    grayscale opacity-60
    group-hover:grayscale-0
    group-hover:opacity-100
    group-hover:scale-110
    transition-all duration-500 ease-out
  "
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary/20 blur-sm rounded-full" />
            </div>

            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
              Your cart is empty
            </h3>

            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-[250px] leading-relaxed">
              Looks like you haven't added any products to your cart yet.
            </p>

            <Link href="/">
              <button className="mt-8 bg-primary text-white dark:text-black px-8 py-3 rounded-xl font-bold uppercase tracking-tighter hover:bg-primary/90 transition-colors">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Table Container */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-primary/10 border-b border-primary/20">
                    <th className="p-4 font-black uppercase italic tracking-tighter text-primary">
                      Product
                    </th>
                    <th className="p-4 font-black uppercase italic tracking-tighter text-primary">
                      Price
                    </th>
                    <th className="p-4 font-black uppercase italic tracking-tighter text-center">
                      Quantity
                    </th>
                    <th className="p-4 font-black uppercase italic tracking-tighter text-primary">
                      Shipping
                    </th>
                    <th className="p-4 font-black uppercase italic tracking-tighter text-primary">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const discountedPrice = calculateDiscountedPrice(
                      item.price,
                      item.discount,
                    );
                    const itemSubtotal = discountedPrice * item.quantity;

                    return (
                      <tr
                        key={item.productId}
                        className="border-b border-border hover:bg-secondary/20 transition-colors"
                      >
                        <td className="p-4 flex items-center gap-4">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-muted-foreground cursor-pointer hover:text-destructive transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="w-20 h-24 shrink-0 bg-muted rounded-lg overflow-hidden relative">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            <h4 className="font-bold text-sm md:text-base">
                              {item.productName}
                            </h4>
                            <p className="text-xs text-muted-foreground italic">
                              Sold by {item.sellerName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Stock:
                              </span>
                              <span
                                className={`text-xs font-semibold ${item.stock <= 5 ? "text-red-600" : item.stock <= 10 ? "text-yellow-600" : "text-green-600"}`}
                              >
                                {item.stock} units
                              </span>
                              {item.stock <= 5 && (
                                <span className="text-xs text-red-600 font-semibold">
                                  (Low Stock)
                                </span>
                              )}
                            </div>
                            {item.discount > 0 && (
                              <p className="text-xs text-green-600 font-semibold">
                                -{item.discount}% discount
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Shipping:
                              </span>
                              <span className="text-xs font-semibold text-primary">
                                {item.shippingFee === 0
                                  ? "Free"
                                  : `$${item.shippingFee.toFixed(2)}/unit`}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-bold text-primary">
                              {cryptoPrices[item.productId] || `$${discountedPrice.toFixed(2)}`}
                            </div>
                            {item.discount > 0 && !cryptoPrices[item.productId] && (
                              <div className="text-xs text-muted-foreground line-through">
                                ${item.price.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-3 border border-border rounded-lg p-2 w-max mx-auto">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              className="hover:text-primary cursor-pointer"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              className={`hover:text-primary cursor-pointer ${
                                item.quantity >= item.stock
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          {item.quantity >= item.stock && (
                            <p className="text-xs text-red-600 text-center mt-1">
                              Max stock reached
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Truck
                              size={14}
                              className="text-muted-foreground"
                            />
                            <span className="font-bold text-primary">
                              {item.shippingFee === 0
                                ? "Free"
                                : cryptoPrices[item.productId] 
                                  ? `${(parseFloat(cryptoPrices[item.productId].split(' ')[0]) * item.quantity).toFixed(6)} ${selectedCoin.symbol}`
                                  : `$${(item.shippingFee * item.quantity).toFixed(2)}`
                              }
                            </span>
                          </div>
                          {item.shippingFee === 0 && (
                            <p className="text-xs text-green-600 text-center mt-1">
                              Free
                            </p>
                          )}
                        </td>
                        <td className="p-4 font-black italic tracking-tighter">
                          {cryptoPrices[item.productId] 
                            ? `${(parseFloat(cryptoPrices[item.productId].split(' ')[0]) * item.quantity).toFixed(6)} ${selectedCoin.symbol}`
                            : `$${(itemSubtotal + item.shippingFee * item.quantity).toFixed(2)}`
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-primary font-bold text-sm underline underline-offset-4 cursor-pointer"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 border border-border rounded-[2rem] p-8 sticky top-24">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-4 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Items</span>
                    <span className="font-bold text-foreground">
                      {totalItems}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Sub Total</span>
                    <span className="font-bold text-foreground">
                      {cryptoTotal ? `${cryptoTotal.toFixed(6)} ${selectedCoin.symbol}` : `$${subtotal.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-bold text-foreground">
                      {cryptoTotal ? (shipping === 0 ? 'Free' : `${(shipping / subtotal * cryptoTotal).toFixed(6)} ${selectedCoin.symbol}`) : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="h-[1px] bg-border my-4" />
                  <div className="flex justify-between text-xl font-black italic tracking-tighter">
                    <span>Total</span>
                    <span>{cryptoTotal ? `${(cryptoTotal + (shipping === 0 ? 0 : shipping / subtotal * cryptoTotal)).toFixed(6)} ${selectedCoin.symbol}` : `$${total.toFixed(2)}`}</span>
                  </div>
                </div>

                <Link href="/auth/login">
                  <button className="w-full bg-primary text-white dark:text-black cursor-pointer py-4 rounded-xl font-black uppercase italic tracking-tighter text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Features Row - From Image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 border-t border-border pt-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Truck />
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-tighter italic">
                Free Shipping
              </h5>
              <p className="text-sm text-muted-foreground">
                For orders above $180
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <CreditCard />
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-tighter italic">
                Flexible Payment
              </h5>
              <p className="text-sm text-muted-foreground">
                Multiple secure options
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Headphones />
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-tighter italic">
                24/7 Support
              </h5>
              <p className="text-sm text-muted-foreground">
                We support online all days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-24 w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center z-0"
          style={{
            backgroundImage:
              "url('https://i.postimg.cc/rmBg1phY/AMARO-Sale.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center text-white px-4 max-w-3xl"
        >
          <span className="font-bold tracking-widest uppercase text-sm mb-4 block">
            Join Our Network
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 leading-tight">
            Ready to expand <br /> your wardrobe?
          </h2>
          <p className="text-lg opacity-80 mb-10 font-light">
            Don&apos;t leave your cart lonely. Complete your purchase now and
            join our community of satisfied shoppers.
          </p>
          <Link href="/">
            <button className="bg-white text-black px-10 py-4 rounded-full cursor-pointer font-bold uppercase tracking-tighter hover:bg-primary hover:text-white transition-colors">
              Continue Shopping
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
