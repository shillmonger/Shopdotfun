"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

/* ======================================================
TYPES & MOCK DATA
====================================================== */

interface SellerLeaderboardEntry {
  id: string;
  name: string;
  businessName: string;
  country: string;
  totalSales: number;
  totalProducts: number;
  totalSalesPercent: number;
  totalProductsPercent: number;
  rank: number;
  joined: string;
  profileImage: string;
}

const trophyImages: Record<number, string> = {
  1: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/Leaderboard%201.png",
  2: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/Leaderboard%202.png",
  3: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/Leaderboard%203.png",
};

export default function SellerLeaderboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sellers, setSellers] = useState<SellerLeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('/api/seller/leaderboard');
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch leaderboard data');
        }
        
        setSellers(result.data || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const topThree = useMemo(() => sellers.slice(0, 3), [sellers]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <SellerNav />

        <main className="flex-1 pb-32 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Header Section - Simplified (Removed Search/Filter) */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-5 border-b border-border pb-6">
              <div className="w-full md:w-auto">
                <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                  Top <span className="text-primary not-italic">Sellers</span>
                </h1>
                <p className="mt-3 text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-[0.3em]">
                  <TrendingUp className="w-4 h-4 text-green-600" /> Live Performance Rankings
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Calculating Rankings...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-red-500 font-black text-sm mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-black"
                >
                  Retry
                </button>
              </div>
            ) : sellers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-muted-foreground font-black text-sm">No sellers found</p>
              </div>
            ) : (
              <>
                {/* Podium Section - Responsive Flex Scroll */}
                <div className="flex md:grid md:grid-cols-3 gap-10 items-end pt-10 px-4 overflow-x-auto pb-8 snap-x no-scrollbar md:overflow-visible">
                  
                  {/* 2nd Place */}
                  <div className="min-w-[280px] md:min-w-0 flex-shrink-0 snap-center cursor-pointer order-2 md:order-1 bg-card border border-border rounded-3xl p-6 flex flex-col items-center relative h-fit pt-12">
                    <img src={trophyImages[2]} className="absolute -top-8 w-20 h-20 object-contain" alt="Silver" />
                    <div className="w-25 h-25 rounded-2xl border-2 border-muted overflow-hidden mb-4">
                      <img src={topThree[1].profileImage} alt="" className="w-full h-full cursor-pointer" />
                    </div>
                    <p className="text-primary font-black text-lg">{topThree[1].totalProductsPercent}%</p>
                    <h3 className="font-black italic uppercase text-sm">{topThree[1].businessName}</h3>
                    <div className="mt-2 px-4 py-1 bg-muted rounded-full text-[10px] font-black">RANK #2</div>
                  </div>

                  {/* 1st Place */}
                  <div className="min-w-[300px] md:min-w-0 flex-shrink-0 cursor-pointer snap-center order-1 md:order-2 bg-foreground text-background rounded-3xl p-8 flex flex-col items-center relative transform md:scale-110 shadow-2xl pt-14">
                    <img src={trophyImages[1]} className="absolute -top-12 w-28 h-28 object-contain" alt="Gold" />
                    <div className="w-30 h-30 rounded-2xl border-2 border-primary overflow-hidden mb-4">
                      <img src={topThree[0].profileImage} alt="" className="w-full h-full cursor-pointer" />
                    </div>
                    <p className="text-primary font-black text-primary-foreground text-3xl">{topThree[0].totalProductsPercent}%</p>
                    <h3 className="font-black italic uppercase text-sm">{topThree[0].businessName}</h3>
                    <div className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-full text-xs font-black italic">IDOLO VENDOR</div>
                  </div>

                  {/* 3rd Place */}
                  <div className="min-w-[280px] md:min-w-0 flex-shrink-0 cursor-pointer snap-center order-3 bg-card border border-border rounded-3xl p-6 flex flex-col items-center relative h-fit pt-12">
                    <img src={trophyImages[3]} className="absolute -top-8 w-20 h-20 object-contain" alt="Bronze" />
                    <div className="w-25 h-25 rounded-2xl border-2 border-muted overflow-hidden mb-4">
                      <img src={topThree[2].profileImage} alt="" className="w-full h-full cursor-pointer" />
                    </div>
                    <p className="text-primary font-black text-lg">{topThree[2].totalProductsPercent}%</p>
                    <h3 className="font-black italic uppercase text-sm">{topThree[2].businessName}</h3>
                    <div className="mt-2 px-4 py-1 bg-muted rounded-full text-[10px] font-black">RANK #3</div>
                  </div>
                </div>

                {/* Table Section - Horizontal Scrollable */}
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Rank</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Photo</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Name & Joined</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Country</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Business Name</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Products %</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Sales %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellers.map((seller) => (
                        <tr key={seller.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors group">
                          <td className="p-6 font-black italic text-xl">#{seller.rank}</td>
                          <td className="p-6">
                            <img src={seller.profileImage} className="w-12 h-12 rounded-lg border-2 border-border" alt={seller.name} />
                          </td>
                          <td className="p-6">
                             <p className="font-black uppercase text-sm leading-none">{seller.name}</p>
                             <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{seller.joined}</p>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-wider">
                              {seller.country}
                            </span>
                          </td>
                          <td className="p-6 font-bold text-sm uppercase">{seller.businessName}</td>
                          <td className="p-6 text-right">
                            <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase">
                              {seller.totalProductsPercent}%
                            </span>
                          </td>
                          <td className="p-6 font-black text-primary text-right text-lg">
                            {seller.totalSalesPercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--primary)); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}