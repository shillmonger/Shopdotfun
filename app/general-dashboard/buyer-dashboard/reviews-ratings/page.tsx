"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  Send,
  Edit3,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type Review = {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewProduct = {
  _id: string;
  name: string;
  sellerName: string;
  images: Array<{
    url: string;
    thumbnailUrl: string;
    publicId: string;
  }>;
  averageRating: number;
  totalRatings: number;
  reviews: Review[];
  createdAt: string;
};

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

export default function ReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ReviewProduct | null>(
    null,
  );
  const [products, setProducts] = useState<ReviewProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/buyer/reviews");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate sum of all ratings
  const calculateTotalRatingPoints = (reviews: Review[] = []) => {
    return reviews.reduce((sum, review) => sum + review.rating, 0);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a star rating");
    if (!selectedProduct) return toast.error("Please select a product");

    try {
      setSubmitting(true);
      const response = await fetch("/api/buyer/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct._id,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const result = await response.json();

      toast.success("Review submitted!", {
        description: "Thank you! Your feedback helps the community.",
      });

      // Update the product in the local state
      setProducts((prev) =>
        prev.map((product) =>
          product._id === selectedProduct._id
            ? {
                ...product,
                averageRating: result.averageRating,
                totalRatings: result.totalRatings,
                reviews: [...(product.reviews || []), result.review],
              }
            : product,
        ),
      );

      // Reset form
      setSelectedProduct(null);
      setRating(0);
      setComment("");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Reviews & Ratings
              </h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                <Star className="w-3 h-3 text-primary fill-current" /> Share
                your experience with the community
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* A. Products Eligible for Review */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-primary" /> Pending Reviews
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className={`bg-card border-2 rounded-2xl p-4 transition-all ${
                          selectedProduct?._id === product._id
                            ? "border-primary"
                            : "border-border"
                        }`}
                      >
                        <div className="flex gap-4">
                          <img
                            src={product.images?.[0]?.url || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-20 h-20 rounded-xl object-cover border border-border"
                          />
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                              {product.sellerName}
                            </p>
                            <h3 className="font-bold text-sm uppercase italic tracking-tighter">
                              {product.name}
                            </h3>

                            {/* Rating Display */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <=
                                      Math.round(product.averageRating || 0)
                                        ? "text-yellow-500 fill-current"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground">
                                {product.averageRating?.toFixed(1) || "0.0"} (
                                {calculateTotalRatingPoints(product.reviews)}{" "}
                                points)
                              </span>
                            </div>

                            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">
                              Added{" "}
                              {new Date(product.createdAt).toLocaleDateString()}
                            </p>

                            <div className="flex w-full lg:justify-end">
                              <button
                                onClick={() => setSelectedProduct(product)}
                                className="mt-3 w-full lg:w-auto text-[10px] font-black uppercase cursor-pointer tracking-widest bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                              >
                                {selectedProduct?._id === product._id
                                  ? "Reviewing..."
                                  : "Write a Review"}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Recent Reviews Preview */}
                        {product.reviews && product.reviews.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                              Recent Reviews
                            </p>
                            <div className="space-y-2">
                              {product.reviews
                                .slice(0, 2)
                                .map((review, index) => (
                                  <div
                                    key={index}
                                    className="bg-muted/30 rounded-lg p-2"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-[9px] font-bold">
                                        {review.userName}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`w-2 h-2 ${
                                              star <= review.rating
                                                ? "text-yellow-500 fill-current"
                                                : "text-muted-foreground"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground line-clamp-2">
                                      {review.comment}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {products.length === 0 && (
                      <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-10 text-center">
                        <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                        <p className="text-xs font-bold text-muted-foreground uppercase">
                          No approved products found
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* B. Review Form Section */}
              <div className="lg:col-span-5">
                {selectedProduct ? (
                  <div className="bg-card border border-border rounded-3xl   py-6 px-4 lg:p-8 sticky top-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">
                      Rate your Purchase
                    </h3>

                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      {/* Star Selection */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Quality Rating
                        </p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHover(star)}
                              onMouseLeave={() => setHover(0)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= (hover || rating)
                                    ? "text-primary fill-current"
                                    : "text-muted border-muted"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text Comment */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Your Thoughts
                        </p>
                        <textarea
                          className="w-full bg-background border border-border rounded-2xl p-4 text-sm min-h-[120px] focus:ring-2 ring-primary/20 outline-none transition-all"
                          placeholder="What did you like or dislike? (e.g. fit, material, delivery speed)"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>

                      {/* Anti-Abuse Note */}
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[9px] font-medium leading-relaxed uppercase tracking-tighter text-primary/80">
                          Reviews are moderated. Abusive language or spam will
                          result in a permanent ban from reviewing.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-foreground text-background py-4 cursor-pointer rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />{" "}
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Review <Send className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-muted/10 border border-border border-dashed rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/20 mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground max-w-[200px] mx-auto">
                      Select a product from the list to start your review
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}
