"use client";

import React, { useState, useMemo } from "react";
import { 
  Percent, 
  Settings2, 
  Layers, 
  UserCheck, 
  Save, 
  ArrowRight, 
  Calculator, 
  ShieldCheck, 
  Info,
  TrendingUp,
  History,
  Lock,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

export default function ConfigureCommissionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Commission States
  const [globalRate, setGlobalRate] = useState(10);
  const [testAmount, setTestAmount] = useState(50000);
  const [categoryFees, setCategoryFees] = useState([
    { id: 1, category: "Electronics", rate: 8 },
    { id: 2, category: "Digital Goods", rate: 15 },
  ]);

  // Preview Calculation Logic
  const preview = useMemo(() => {
    const fee = (testAmount * globalRate) / 100;
    const sellerEarnings = testAmount - fee;
    return { fee, sellerEarnings };
  }, [testAmount, globalRate]);

  const handleSave = () => {
    toast.success("Financial Rules Updated", {
      description: `New global commission of ${globalRate}% is now locked for all future transactions.`
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Revenue <span className="text-primary not-italic">Logic</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Settings2 className="w-3 h-3 text-primary" /> Define platform fees &amp; merchant splits
                </p>
              </div>
              <button 
                onClick={handleSave}
                className="bg-foreground text-background px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2 shadow-xl shadow-primary/10"
              >
                <Save className="w-4 h-4" /> Save Commission Structure
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* A. Commission Settings */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Global Rate Card */}
                <div className="bg-card border-2 border-primary/20 rounded-[2rem] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                      <Percent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none">Global Commission</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Default rate for all categories</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={globalRate}
                      onChange={(e) => setGlobalRate(Number(e.target.value))}
                      className="flex-1 accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
                    />
                    <div className="w-24 bg-background border border-border rounded-2xl py-3 px-4 text-center">
                      <span className="text-2xl font-black italic">{globalRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Category Overrides */}
                <div className="bg-card border border-border rounded-[2rem] p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-black uppercase italic tracking-tighter">Category Overrides</h3>
                    </div>
                    <button className="text-[10px] font-black uppercase flex items-center gap-1 text-primary hover:underline">
                      <Plus className="w-3 h-3" /> Add Category
                    </button>
                  </div>

                  <div className="space-y-3">
                    {categoryFees.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-2xl">
                        <span className="text-[11px] font-black uppercase italic tracking-tight">{cat.category}</span>
                        <div className="flex items-center gap-4">
                          <div className="bg-background border border-border px-3 py-1.5 rounded-lg text-[11px] font-black">
                            {cat.rate}%
                          </div>
                          <button className="text-destructive opacity-40 hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Immutable Notice */}
                <div className="bg-muted/30 border border-dashed border-border rounded-[2rem] p-6 flex items-start gap-4">
                  <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed italic">
                    Commission rates are &quot;Snapshot Locked&quot; at the moment of order creation. Changing these values will not retroactively affect existing orders to ensure financial integrity.
                  </p>
                </div>
              </div>

              {/* B. Calculation Preview */}
              <div className="lg:col-span-5">
                <div className="bg-foreground text-background rounded-[2rem] p-8 sticky top-24 shadow-2xl">
  <div className="flex items-center gap-3 mb-8">
    <Calculator className="w-6 h-6 text-primary" />
    <h3 className="text-xl font-black uppercase italic tracking-tighter">Live Preview</h3>
  </div>

  <div className="space-y-6">
    <div>
      <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block">
        Test Sale Amount (₦)
      </label>
      <input 
        type="number" 
        value={testAmount}
        onChange={(e) => setTestAmount(Number(e.target.value))}
        className="w-full bg-background/10 border border-background/20 rounded-xl p-4 text-xl font-black italic outline-none focus:border-primary transition-all text-background"
      />
    </div>

    {/* FIXED: Border changed from white/10 to background/10 */}
    <div className="space-y-4 pt-6 border-t border-background/10">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold opacity-60 uppercase tracking-tighter">Platform Fee ({globalRate}%)</span>
        <span className="font-black text-primary italic">+ ₦{preview.fee.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center text-lg">
        <span className="font-bold opacity-60 uppercase tracking-tighter">Seller Net Pay</span>
        <span className="font-black italic">₦{preview.sellerEarnings.toLocaleString()}</span>
      </div>
    </div>

    {/* FIXED: Background and border changed to dynamic background color */}
    <div className="mt-8 p-4 bg-background/5 border border-background/10 rounded-2xl flex items-center gap-4">
      <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
      <p className="text-[9px] font-medium uppercase leading-tight opacity-70">
        Based on current volume, this configuration is estimated to generate ₦1.2M in platform revenue this month.
      </p>
    </div>
  </div>
</div>
              </div>

            </div>
          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}