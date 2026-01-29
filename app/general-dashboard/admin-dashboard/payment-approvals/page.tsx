"use client";

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  Wallet,
  User,
  Hash,
  AlertCircle,
  Eye,
  ShieldCheck,
  Filter,
  Package,
  Globe,
  ChevronDown,
  Calendar,
  Mail,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import {
  format,
  isToday,
  isYesterday,
  isAfter,
  subDays,
  parseISO,
} from "date-fns";

// Layout Components
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// ShadCN UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Types ---
type StatusType = "pending" | "approved" | "rejected";

interface Payment {
  _id: string;
  buyerInfo: {
    orderTotal: number;
    amountToPay: number;
    username: string;
    email: string;
    phoneNumber: string;
    country: string;
    cryptoMethodUsed: string;
    timePaid: string;
  };
  productsInfo: {
    productCode: string;
    name: string;
    price: number;
    sellerInfo: {
      sellerName: string;
      sellerEmail: string;
    };
  }[];
  status: StatusType;
  cryptoAmount: string;
  cryptoAddress: string;
  createdAt: string;
}

const MOCK_DATA: Payment[] = [
  {
    _id: "697b13ec07ad2c1ba4e1affb",
    buyerInfo: {
      orderTotal: 142.34,
      amountToPay: 142.34,
      username: "Bby Lion",
      email: "bbylion619@gmail.com",
      phoneNumber: "+2348186774684",
      country: "United Kingdom",
      cryptoMethodUsed: "VTC",
      timePaid: "2026-01-29T08:01:48.592Z",
    },
    productsInfo: [
      {
        productCode: "66339",
        name: "ronClad K90 Mechanical Keyboard",
        price: 33,
        sellerInfo: {
          sellerName: "Shillmonger",
          sellerEmail: "shillmonger0@gmail.com",
        },
      },
      {
        productCode: "35321",
        name: "Noice free headset",
        price: 100,
        sellerInfo: {
          sellerName: "Code Lab",
          sellerEmail: "codelab042@gmail.com",
        },
      },
    ],
    status: "pending",
    cryptoAmount: "2086.75318115",
    cryptoAddress: "vtc1qkh4ccr27f5c9yp44vmnud7ljgvfqh5s6hy0f54",
    createdAt: "2026-01-29T08:01:48.595Z",
  },
];

export default function ApproveManualPaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(MOCK_DATA);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const pDate = parseISO(p.createdAt);
      const matchesStatus =
        statusFilter === "All" || p.status === statusFilter.toLowerCase();
      let matchesDate = true;
      if (dateFilter === "Today") matchesDate = isToday(pDate);
      else if (dateFilter === "Yesterday") matchesDate = isYesterday(pDate);
      else if (dateFilter === "Last 7 Days")
        matchesDate = isAfter(pDate, subDays(new Date(), 7));
      return matchesStatus && matchesDate;
    });
  }, [payments, statusFilter, dateFilter]);

  const handleDecision = (id: string, decision: "approved" | "rejected") => {
    setPayments((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status: decision } : p)),
    );
    if (decision === "approved") {
      toast.success("Transaction Confirmed", {
        description: `Payment verified for Order ${id.slice(-6)}`,
      });
    } else {
      toast.error("Transaction Declined", {
        description: "The payment entry has been rejected.",
      });
    }
    setSelectedPayment(null);
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
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Header + Filters */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Payment{" "}
                  <span className="text-primary not-italic">Auditor</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Incoming
                  Transaction Reconciliation
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-black uppercase text-[10px] h-10 border-2 rounded-xl cursor-pointer"
                    >
                      <Filter className="w-3 h-3 mr-2" /> Status: {statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="uppercase font-bold text-[10px]"
                  >
                    {["All", "Pending", "Approved", "Rejected"].map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className="cursor-pointer"
                      >
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-black uppercase text-[10px] h-10 border-2 rounded-xl cursor-pointer"
                    >
                      <Calendar className="w-3 h-3 mr-2" /> {dateFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="uppercase font-bold text-[10px]"
                  >
                    {["All Time", "Today", "Yesterday", "Last 7 Days"].map(
                      (d) => (
                        <DropdownMenuItem
                          key={d}
                          onClick={() => setDateFilter(d)}
                          className="cursor-pointer"
                        >
                          {d}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Table Section */}
              <div className="lg:col-span-7 bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border bg-muted/20">
                  <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Reconciliation Queue: {filteredPayments.length} Entries
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Buyer Account
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Order Value
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground text-right italic">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredPayments.map((pay) => (
                        <tr
                          key={pay._id}
                          className={`group hover:bg-muted/30 transition-colors ${selectedPayment?._id === pay._id ? "bg-primary/5" : ""}`}
                        >
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-xs uppercase italic tracking-tighter">
                                {pay.buyerInfo.username}
                              </span>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                <Globe className="w-2 h-2" />{" "}
                                {pay.buyerInfo.country}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-sm text-primary italic">
                                {pay.cryptoAmount}{" "}
                                {pay.buyerInfo.cryptoMethodUsed}
                              </span>
                              <span className="text-[8px] font-bold opacity-50 uppercase tracking-tighter">
                                Est. Value: ${pay.buyerInfo.amountToPay}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <Badge
                              variant="outline"
                              className={`uppercase text-[9px] font-black px-2 py-0.5 rounded-md ${
                                pay.status === "approved"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : pay.status === "rejected"
                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                    : "bg-yellow-500/10 text-yellow-600"
                              }`}
                            >
                              {pay.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => setSelectedPayment(pay)}
                              className="p-2.5 bg-background border-2 border-border rounded-xl group-hover:border-primary transition-all cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredPayments.length === 0 && (
                    <div className="p-20 text-center text-[10px] font-black uppercase opacity-20 tracking-[0.2em]">
                      No transactions pending review
                    </div>
                  )}
                </div>
              </div>

              {/* Side Detail Panel (Audit Desk) */}
              <div className="lg:col-span-5">
                {selectedPayment ? (
                  <div className="bg-card border-2 border-primary rounded-[3rem] p-8 space-y-6 sticky top-24 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-black uppercase text-primary tracking-widest mb-1">
                          Transaction Insight
                        </p>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">
                          ID: ...{selectedPayment._id.slice(-8)}
                        </h3>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3" /> Received{" "}
                        {format(parseISO(selectedPayment.createdAt), "HH:mm")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-background border border-border p-4 rounded-2xl space-y-3">
                        <div>
                          <p className="text-[8px] font-black uppercase opacity-40 mb-1 flex items-center gap-1">
                            <User className="w-2.5 h-2.5" /> Customer Details
                          </p>
                          <p className="text-[10px] font-bold uppercase">
                            {selectedPayment.buyerInfo.username}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" />{" "}
                            {selectedPayment.buyerInfo.email}
                          </p>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-[8px] font-black uppercase opacity-40 mb-1 flex items-center gap-1">
                            <Package className="w-2.5 h-2.5" /> Order Summary
                          </p>
                          {selectedPayment.productsInfo.map((p, i) => (
                            <p
                              key={i}
                              className="text-[10px] font-bold uppercase"
                            >
                              {p.name} —{" "}
                              <span className="text-primary">${p.price}</span>
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl space-y-2">
                        <p className="text-[9px] font-black uppercase text-primary flex items-center gap-1">
                          <Hash className="w-3 h-3" /> Payment Source Address
                        </p>
                        <code className="text-[10px] font-bold break-all block p-2 bg-background/50 rounded-lg">
                          {selectedPayment.cryptoAddress}
                        </code>
                      </div>
                    </div>

                    {selectedPayment.status === "pending" ? (
                      <div className="grid grid-cols-2 gap-3 pt-4">
                        {/* Decline Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="flex items-center justify-center gap-2 border-2 border-[#ef4444] bg-[#ef4444] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ef4444] hover:text-white transition-all cursor-pointer">
                              <XCircle className="w-4 h-4" /> Decline
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem] border-2 border-red-500">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="uppercase font-black italic text-2xl text-red-600">
                                Reject Transaction?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-xs font-bold uppercase tracking-tight">
                                You are about to flag this payment as invalid.
                                The user will be requested to provide valid
                                proof of transfer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px] cursor-pointer">
                                Back
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDecision(
                                    selectedPayment._id,
                                    "rejected",
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase text-[10px] cursor-pointer"
                              >
                                Confirm Rejection
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {/* Verify Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="flex items-center justify-center gap-2 bg-[#22c55e] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#16a34a] transition-all shadow-lg shadow-green-500/20 cursor-pointer">
                              <CheckCircle2 className="w-4 h-4" /> Verify
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem] border-2 border-green-500">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="uppercase font-black italic text-2xl text-green-600">
                                Confirm Payment?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-xs font-bold uppercase tracking-tight">
                                Audit Complete: Mark this order as PAID. This
                                will fulfill the order and notify the buyer of
                                success.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px] cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDecision(
                                    selectedPayment._id,
                                    "approved",
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold uppercase text-[10px] cursor-pointer"
                              >
                                Authorize Order
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ) : (
                      <div
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border-2 border-dashed ${selectedPayment.status === "approved" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
                      >
                        Audit Finalized: {selectedPayment.status}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <Receipt className="w-16 h-16 mb-6 text-muted-foreground" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-[200px]">
                      Select a transaction to begin the audit process
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Info Alert */}
            <div className="bg-muted/30 border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight leading-relaxed">
                Security Protocol: Verification of manual transfers is a final
                action. Ensure the crypto amount of **
                {selectedPayment?.cryptoAmount || "0.00"}** matches the
                destination wallet balance before authorizing.
              </p>
            </div>
          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}
