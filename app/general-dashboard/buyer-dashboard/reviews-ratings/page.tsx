"use client";

import React, { useState } from "react";
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Image as ImageIcon,
  Send,
  Edit3
} from "lucide-react";
import { toast } from "sonner";

type ReviewProduct = {
  id: string;
  name: string;
  seller: string;
  image: string;
  orderDate: string;
};

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

// Mock Data
const ELIGIBLE_PRODUCTS: ReviewProduct[] = [
  {
    id: "p1",
    name: "Classic Leather Sneakers",
    seller: "Elite Footwear",
    image: "https://i.postimg.cc/pLD6CsVc/download-(5).jpg",
    orderDate: "Jan 12, 2026"
  },
  {
    id: "p2",
    name: "Minimalist Desk Lamp",
    seller: "Modern Home",
    image: "https://i.postimg.cc/pLD6CsVc/download-(5).jpg",
    orderDate: "Jan 14, 2026"
  }
];

export default function ReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ReviewProduct | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a star rating");
    
    // Logic to save review would go here
    toast.success("Review submitted!", {
      description: "Thank you! Your feedback helps the community.",
    });
    
    // Reset form
    setSelectedProduct(null);
    setRating(0);
    setComment("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Reviews & Ratings
              </h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                <Star className="w-3 h-3 text-primary fill-current" /> Share your experience with the community
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* A. Products Eligible for Review */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-primary" /> Pending Reviews
                </h2>

                {ELIGIBLE_PRODUCTS.map((product) => (
                  <div 
                    key={product.id}
                    className={`bg-card border-2 rounded-2xl p-4 transition-all ${
                      selectedProduct?.id === product.id ? "border-primary" : "border-border"
                    }`}
                  >
                    <div className="flex gap-4">
                      <img src={product.image} alt="" className="w-20 h-20 rounded-xl object-cover border border-border" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{product.seller}</p>
                        <h3 className="font-bold text-sm uppercase italic tracking-tighter">{product.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Delivered on {product.orderDate}</p>
                        
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="mt-3 text-[10px] font-black uppercase cursor-pointer tracking-widest bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                        >
                          {selectedProduct?.id === product.id ? "Reviewing..." : "Write a Review"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {ELIGIBLE_PRODUCTS.length === 0 && (
                  <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-10 text-center">
                    <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                    <p className="text-xs font-bold text-muted-foreground uppercase">No pending reviews</p>
                  </div>
                )}
              </div>

              {/* B. Review Form Section */}
              <div className="lg:col-span-5">
                {selectedProduct ? (
                  <div className="bg-card border border-border rounded-3xl p-8 sticky top-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">
                      Rate your Purchase
                    </h3>

                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      {/* Star Selection */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quality Rating</p>
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Thoughts</p>
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
                          Reviews are moderated. Abusive language or spam will result in a permanent ban from reviewing.
                        </p>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-foreground text-background py-4 cursor-pointer rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all shadow-xl active:scale-95"
                      >
                        Submit Review <Send className="w-3 h-3" />
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