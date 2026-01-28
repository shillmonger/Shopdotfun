"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Percent,
  Settings2,
  Layers,
  Save,
  Calculator,
  AlertCircle,
  Hash,
  ArrowRight,
  TrendingUp,
  Lock,
  Info,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

// Shadcn UI Components (Ensure these are installed via npx shadcn@latest add dropdown-menu)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Types
interface CommissionTier {
  id: string;
  min: number;
  max: number | null;
  type: "percent" | "flat";
  value: number;
}

export default function ConfigureCommissionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [testAmount, setTestAmount] = useState(15000);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [commissionTiers, setCommissionTiers] = useState<CommissionTier[]>([
    { id: "1", min: 0, max: 5, type: "percent", value: 0 },
    { id: "2", min: 5, max: 20, type: "percent", value: 5 },
    { id: "3", min: 20, max: 100, type: "percent", value: 7 },
    { id: "4", min: 100, max: 500, type: "percent", value: 8 },
    { id: "5", min: 500, max: 1000, type: "percent", value: 6 },
    { id: "6", min: 1000, max: null, type: "flat", value: 50 },
  ]);

  // Load commission settings from API on component mount
  useEffect(() => {
    const loadCommissionSettings = async () => {
      try {
        const response = await fetch('/api/admin/commission');
        if (response.ok) {
          const data = await response.json();
          if (data.settings && data.settings.tiers) {
            setCommissionTiers(data.settings.tiers);
          }
        }
      } catch (error) {
        console.error('Error loading commission settings:', error);
        toast.error("Failed to load settings", {
          description: "Using default commission tiers.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCommissionSettings();
  }, []);

  const errors = useMemo(() => {
    const errs: string[] = [];
    commissionTiers.forEach((tier, index) => {
      if (tier.min < 0 || tier.value < 0)
        errs.push(`Tier ${index + 1}: Negative values not allowed.`);
      if (tier.max !== null && tier.max <= tier.min)
        errs.push(`Tier ${index + 1}: Max must be greater than Min.`);

      commissionTiers.forEach((otherTier, otherIndex) => {
        if (index === otherIndex) return;
        const isOverlap =
          (tier.max === null || otherTier.min < tier.max) &&
          (otherTier.max === null || tier.min < otherTier.max);
        if (isOverlap) {
          const msg = `Overlap detected between Tier ${index + 1} and Tier ${otherIndex + 1}.`;
          if (!errs.includes(msg)) errs.push(msg);
        }
      });
    });
    return errs;
  }, [commissionTiers]);

  const preview = useMemo(() => {
    const amount = testAmount;
    const activeTier = commissionTiers.find(
      (t) => amount >= t.min && (t.max === null || amount < t.max),
    );

    if (!activeTier) return { fee: 0, earnings: amount, tier: null };

    const fee =
      activeTier.type === "percent"
        ? (amount * activeTier.value) / 100
        : activeTier.value;

    return {
      fee,
      earnings: Math.max(0, amount - fee),
      tier: activeTier,
    };
  }, [testAmount, commissionTiers]);

  const updateTier = (id: string, field: keyof CommissionTier, value: any) => {
    setCommissionTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const handleSave = async () => {
    if (errors.length > 0) {
      toast.error("Invalid Configuration", {
        description: "Please fix overlapping or negative ranges.",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/commission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tiers: commissionTiers }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Financial Rules Updated", {
          description: `${commissionTiers.length} commission tiers have been synchronized.`,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving commission settings:', error);
      toast.error("Save Failed", {
        description: "Could not save commission settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Revenue <span className="text-primary not-italic">Logic</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Settings2 className="w-3 h-3 text-primary" /> Tier-based
                  platform fees (USDT)
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={errors.length > 0 || loading || saving}
                className="bg-foreground text-background px-4 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-xl shadow-primary/10 cursor-pointer"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Tier Structure
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* A. Tier Manager */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-card border-2 border-primary/20 rounded-[2rem] p-6 md:p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none text-foreground">
                          Commission Tiers
                        </h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                          Define fee ranges based on price (USDT)
                        </p>
                      </div>
                    </div>
                  </div>

                  {errors.length > 0 && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <div className="text-[10px] font-bold text-destructive uppercase">
                        {errors.map((err, i) => (
                          <p key={i}>{err}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      commissionTiers.map((tier) => {
                        const isActive = preview.tier?.id === tier.id;
                        return (
                          <div
                            key={tier.id}
                            className={`group transition-all duration-300 grid grid-cols-2 md:grid-cols-12 gap-4 p-4 rounded-2xl border ${
                              isActive
                                ? "bg-primary/5 border-primary shadow-lg scale-[1.01]"
                                : "bg-muted/30 border-border"
                            }`}
                          >
                          {/* Min Price - Spans 1 col on small, 3 on md */}
                            <div className="col-span-1 md:col-span-3">
                            <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">
                              Min (USDT)
                            </label>
                            <input
                              type="number"
                              value={tier.min}
                              onChange={(e) =>
                                updateTier(
                                  tier.id,
                                  "min",
                                  Number(e.target.value),
                                )
                              }
                              className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm font-bold focus:ring-1 ring-primary outline-none"
                            />
                            </div>

                            {/* Max Price - Spans 1 col on small, 3 on md */}
                            <div className="col-span-1 md:col-span-3">
                            <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">
                              Max (USDT)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                placeholder="∞"
                                value={tier.max ?? ""}
                                onChange={(e) =>
                                  updateTier(
                                    tier.id,
                                    "max",
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value),
                                  )
                                }
                                className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm font-bold focus:ring-1 ring-primary outline-none"
                              />
                            </div>
                            </div>

                            {/* Fee Type Dropdown - Spans 1 col on small, 3 on md */}
                            <div className="col-span-1 md:col-span-3">
                            <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">
                              Fee Type
                            </label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm font-bold flex items-center justify-between outline-none cursor-pointer hover:border-primary transition-colors text-left">
                                  <span className="truncate">
                                    {tier.type === "percent"
                                      ? "Percentage"
                                      : "Flat"}
                                  </span>
                                  <ChevronDown className="w-3 h-3 opacity-50 shrink-0 ml-1" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="start"
                                className="w-48 bg-popover border-border"
                              >
                                <DropdownMenuItem
                                  className="cursor-pointer text-xs font-bold"
                                  onClick={() =>
                                    updateTier(tier.id, "type", "percent")
                                  }
                                >
                                  Percentage (%)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer text-xs font-bold"
                                  onClick={() =>
                                    updateTier(tier.id, "type", "flat")
                                  }
                                >
                                  Flat (USDT)
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            </div>

                            {/* Value - Spans 1 col on small, 2 on md (Leaving 1 for a delete button if needed) */}
                            <div className="col-span-1 md:col-span-3">
                            <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">
                              Value
                            </label>
                            <input
                              type="number"
                              value={tier.value}
                              onChange={(e) =>
                                updateTier(
                                  tier.id,
                                  "value",
                                  Number(e.target.value),
                                )
                              }
                              className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm font-bold focus:ring-1 ring-primary outline-none"
                            />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-muted/30 border border-dashed border-border rounded-[2rem] p-6 flex items-start gap-4">
                  <Info className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed italic">
                      Range Logic: Tiers use an inclusive minimum and exclusive
                      maximum. Example: 0 - 5 USDT covers up to 4.99 USDT.
                    </p>
                  </div>
                </div>
              </div>

              {/* B. Calculation Preview */}
              <div className="lg:col-span-5">
                <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-[2rem] p-8 sticky top-24 shadow-2xl transition-all border-2 border-primary/20">
                  <div className="flex items-center gap-3 mb-8 border-b border-white/10 dark:border-zinc-200 pb-4">
                    <Calculator className="w-6 h-6 dark:text-zinc-500" />
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">
                      Live Preview
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between">
                        <label className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest mb-2 block">
                          Test Sale Amount (USDT)
                        </label>
                        <span className="text-[9px] font-bold dark:text-zinc-500 uppercase animate-pulse">
                          Live Simulator
                        </span>
                      </div>
                      <input
                        type="number"
                        value={testAmount}
                        onChange={(e) => setTestAmount(Number(e.target.value))}
                        className="w-full bg-white/5 dark:bg-zinc-100 border border-white/10 dark:border-zinc-200 rounded-xl p-4 text-xl font-black italic outline-none focus:border-primary transition-all text-white dark:text-zinc-950 placeholder:text-zinc-600 dark:placeholder:text-zinc-400"
                      />
                    </div>

                    <div className="space-y-4 pt-6">
                      {preview.tier ? (
                        <>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter">
                              Matched Tier
                            </span>
                            <span className="font-black dark:text-zinc-500 italic px-3 py-1 bg-primary/60 rounded-full border border-primary/80">
                              {preview.tier.min} -{" "}
                              {preview.tier.max ? `${preview.tier.max}` : "∞"}{" "}
                              USDT
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter">
                              Platform Fee ({preview.tier.value}
                              {preview.tier.type === "percent" ? "%" : " Flat"})
                            </span>
                            <span className="font-black dark:text-zinc-500 italic">
                              + {preview.fee.toLocaleString()} USDT
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-lg pt-4 border-t border-white/5 dark:border-zinc-100">
                            <span className="font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter">
                              Seller Net Pay
                            </span>
                            <span className="font-black italic text-white dark:text-zinc-950 text-2xl tracking-tight">
                              {preview.earnings.toLocaleString()}{" "}
                              <span className="text-xs not-italic text-zinc-500 dark:text-zinc-400">
                                USDT
                              </span>
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 bg-destructive/10 rounded-xl border border-destructive/20">
                          <p className="text-[10px] font-black uppercase text-destructive">
                            No matching tier found
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer Info Box */}
                    <div className="mt-8 p-4 bg-white/5 dark:bg-zinc-100 border border-white/10 dark:border-zinc-200 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 dark:text-zinc-500" />
                      </div>
                      <p className="text-[9px] font-medium uppercase leading-tight text-zinc-400 dark:text-zinc-600">
                        “{testAmount.toLocaleString()} USDT falls in{" "}
                        {preview.tier?.min}–{preview.tier?.max || "∞"} range →{" "}
                        {preview.tier?.value}
                        {preview.tier?.type === "percent" ? "%" : " flat"} fee
                        applied”
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
