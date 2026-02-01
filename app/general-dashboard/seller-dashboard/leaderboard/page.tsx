"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Trophy,
  Medal,
  TrendingUp,
  Search,
  Filter,
  User,
  ArrowUpRight,
  Loader2,
  ChevronUp,
  ChevronDown
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
  totalSales: number;
  rating: number;
  rank: number;
  joined: string;
  profileImage: string;
}

const trophyImages: Record<number, string> = {
  1: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/Leaderboard%201.png",
  2: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/Leaderboard%202.png",
  3: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/Leaderboard%203.png",
};

/* ======================================================
MAIN PAGE
====================================================== */

export default function SellerLeaderboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Mocking the fetched data structure
  const [sellers, setSellers] = useState<SellerLeaderboardEntry[]>([
    { id: "1", name: "Neo Store", totalSales: 15400, rating: 4.9, rank: 1, joined: "Jan 2024", profileImage: "https://github.com/shadcn.png" },
    { id: "2", name: "Cyber Tech", totalSales: 12200, rating: 4.8, rank: 2, joined: "Feb 2024", profileImage: "https://github.com/shadcn.png" },
    { id: "3", name: "Elite Goods", totalSales: 9800, rating: 4.7, rank: 3, joined: "Mar 2024", profileImage: "https://github.com/shadcn.png" },
    { id: "4", name: "Alpha Traders", totalSales: 8500, rating: 4.6, rank: 4, joined: "Apr 2024", profileImage: "https://github.com/shadcn.png" },
    { id: "5", name: "Prime Vendor", totalSales: 7200, rating: 4.5, rank: 5, joined: "May 2024", profileImage: "https://github.com/shadcn.png" },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const topThree = useMemo(() => sellers.slice(0, 3), [sellers]);
  
  const filteredSellers = useMemo(() => {
    return sellers.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sellers, searchTerm]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <SellerNav />

        <main className="flex-1 pb-32 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-5 border-b border-border pb-6">
              <div className="w-full md:w-auto">
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                  Top <span className="text-primary not-italic">Sellers</span>
                </h1>
                <p className="mt-3 text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-[0.3em]">
                  <TrendingUp className="w-4 h-4 text-green-600" /> Live Performance Rankings
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    placeholder="SEARCH VENDORS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 h-10 rounded-xl border bg-card text-[10px] font-black uppercase tracking-widest focus:ring-2 ring-primary/20 outline-none"
                  />
                </div>
                <button className="border h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted transition cursor-pointer">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Calculating Rankings...</p>
              </div>
            ) : (
              <>
                {/* Podium Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10 px-4">
                  {/* 2nd Place */}
                  <div className="order-2 md:order-1 bg-card border border-border rounded-3xl p-6 flex flex-col items-center relative h-fit pt-12">
                    <img src={trophyImages[2]} className="absolute -top-8 w-20 h-20 object-contain" alt="Silver" />
                    <div className="w-20 h-20 rounded-full border-4 border-muted overflow-hidden mb-4">
                      <img src={topThree[1].profileImage} alt="" className="w-full h-full" />
                    </div>
                    <h3 className="font-black italic uppercase text-lg">{topThree[1].name}</h3>
                    <p className="text-primary font-black text-xl">${topThree[1].totalSales.toLocaleString()}</p>
                    <div className="mt-4 px-4 py-1 bg-muted rounded-full text-[10px] font-black">RANK #2</div>
                  </div>

                  {/* 1st Place */}
                  <div className="order-1 md:order-2 bg-foreground text-background rounded-3xl p-8 flex flex-col items-center relative transform md:scale-110 shadow-2xl pt-14">
                    <img src={trophyImages[1]} className="absolute -top-12 w-28 h-28 object-contain" alt="Gold" />
                    <div className="w-24 h-24 rounded-full border-4 border-primary overflow-hidden mb-4">
                      <img src={topThree[0].profileImage} alt="" className="w-full h-full" />
                    </div>
                    <h3 className="font-black italic uppercase text-2xl">{topThree[0].name}</h3>
                    <p className="text-primary font-black text-3xl">${topThree[0].totalSales.toLocaleString()}</p>
                    <div className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full text-xs font-black italic">ULTIMATE VENDOR</div>
                  </div>

                  {/* 3rd Place */}
                  <div className="order-3 bg-card border border-border rounded-3xl p-6 flex flex-col items-center relative h-fit pt-12">
                    <img src={trophyImages[3]} className="absolute -top-8 w-20 h-20 object-contain" alt="Bronze" />
                    <div className="w-20 h-20 rounded-full border-4 border-muted overflow-hidden mb-4">
                      <img src={topThree[2].profileImage} alt="" className="w-full h-full" />
                    </div>
                    <h3 className="font-black italic uppercase text-lg">{topThree[2].name}</h3>
                    <p className="text-primary font-black text-xl">${topThree[2].totalSales.toLocaleString()}</p>
                    <div className="mt-4 px-4 py-1 bg-muted rounded-full text-[10px] font-black">RANK #3</div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Rank</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Vendor</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Total Sales</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Rating</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSellers.map((seller) => (
                        <tr key={seller.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors group">
                          <td className="p-6 font-black italic text-xl">#{seller.rank}</td>
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <img src={seller.profileImage} className="w-10 h-10 rounded-xl" alt="" />
                              <div>
                                <p className="font-black uppercase text-sm leading-none">{seller.name}</p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">Joined {seller.joined}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 font-black text-primary">${seller.totalSales.toLocaleString()}</td>
                          <td className="p-6">
                            <div className="flex items-center gap-1.5">
                              <Trophy className="w-3 h-3 text-amber-500" />
                              <span className="font-black text-sm">{seller.rating}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <button className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--primary)); }
      `}</style>
    </div>
  );
}