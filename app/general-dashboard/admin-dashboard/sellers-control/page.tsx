"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  FileSearch, 
  Mail, 
  Calendar,
  Building2,
  ExternalLink,
  History,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Data
const INITIAL_SELLERS = [
  {
    id: "SEL-101",
    name: "Alex Johnson",
    email: "alex@techstore.io",
    businessName: "TechStore IO",
    verification: "Pending",
    status: "Pending",
    joined: "Jan 15, 2026",
    docs: ["Identity_Doc.pdf", "Business_License.png"],
    warnings: 0
  },
  {
    id: "SEL-102",
    name: "Sarah Mode",
    email: "sarah@fashion.com",
    businessName: "Sarah's Boutique",
    verification: "Verified",
    status: "Active",
    joined: "Dec 10, 2025",
    docs: ["Proof_of_Address.pdf"],
    warnings: 1
  }
];

export default function AdminSellerManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sellers, setSellers] = useState(INITIAL_SELLERS);
  const [selectedSeller, setSelectedSeller] = useState<typeof INITIAL_SELLERS[0] | null>(null);
  const [reason, setReason] = useState("");

  const handleAction = (id: string, newStatus: string) => {
    if ((newStatus === "Suspended" || newStatus === "Rejected") && !reason) {
      return toast.error("Mandatory Field", {
        description: "A reason must be provided for suspension or rejection."
      });
    }

    setSellers(sellers.map(s => s.id === id ? { ...s, status: newStatus } : s));
    toast.success(`Account ${newStatus}`, {
      description: `Notification email has been sent to the merchant.`
    });
    setReason("");
    setSelectedSeller(null);
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
                  Merchant <span className="text-primary not-italic">Control</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Approval & Compliance Management
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search Merchants..." 
                    className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Seller List Table */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Merchant</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Verification</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sellers.map((seller) => (
                        <tr key={seller.id} className={`hover:bg-muted/20 transition-colors ${selectedSeller?.id === seller.id ? 'bg-primary/5' : ''}`}>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-sm uppercase italic tracking-tighter">{seller.businessName}</span>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">{seller.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                              seller.verification === "Verified" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            }`}>
                              {seller.verification}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                              seller.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                              seller.status === "Suspended" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-muted text-muted-foreground border-border"
                            }`}>
                              {seller.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => setSelectedSeller(seller)}
                              className="p-2 border border-border rounded-lg hover:bg-primary hover:text-white transition-all"
                            >
                              <FileSearch className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Seller Detail View (Side Panel) */}
              <div className="lg:col-span-4">
                {selectedSeller ? (
                  <div className="bg-card border-2 border-primary rounded-[2rem] p-8 space-y-6 sticky top-24">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Review Merchant</h3>
                      <button onClick={() => setSelectedSeller(null)} className="p-1 hover:bg-muted rounded-md"><XCircle className="w-5 h-5 opacity-40"/></button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-primary" />
                        <div className="text-[10px] font-bold uppercase">{selectedSeller.businessName}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-primary" />
                        <div className="text-[10px] font-bold uppercase">{selectedSeller.email}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <div className="text-[10px] font-bold uppercase">Registered: {selectedSeller.joined}</div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">KYC Documents</p>
                      {selectedSeller.docs.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                          <span className="text-[9px] font-bold uppercase">{doc}</span>
                          <ExternalLink className="w-3 h-3 text-primary cursor-pointer" />
                        </div>
                      ))}
                    </div>

                    {/* Suspension Logic */}
                    <div className="pt-6 border-t border-border space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-destructive">Decision Reason (Required for Reject/Suspend)</label>
                      <textarea 
                        className="w-full bg-background border border-border rounded-xl p-4 text-[10px] font-bold uppercase outline-none focus:ring-2 ring-primary/20"
                        placeholder="State why this action is being taken..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      {selectedSeller.status === "Pending" ? (
                        <>
                          <button 
                            onClick={() => handleAction(selectedSeller.id, "Active")}
                            className="bg-primary text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                          >
                            <UserCheck className="w-4 h-4" /> Approve
                          </button>
                          <button 
                            onClick={() => handleAction(selectedSeller.id, "Rejected")}
                            className="border border-destructive text-destructive py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                          >
                            <UserX className="w-4 h-4" /> Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleAction(selectedSeller.id, "Active")}
                            className="border border-primary text-primary py-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                            Reinstate
                          </button>
                          <button 
                            onClick={() => handleAction(selectedSeller.id, "Suspended")}
                            className="bg-destructive text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                            Suspend
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border-2 border-dashed border-border rounded-[2rem] p-12 flex flex-col items-center justify-center text-center opacity-40">
                    <History className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Select a merchant from the list to view documentation and take action.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance Note */}
            <div className="mt-8 flex items-start gap-4 bg-primary/5 border border-primary/20 p-6 rounded-[2rem]">
              <AlertCircle className="w-5 h-5 text-primary shrink-0" />
              <p className="text-[10px] font-bold text-primary/80 uppercase tracking-tight leading-relaxed">
                Platform Policy: Suspended sellers are automatically restricted from listing new products, accessing escrow payouts, or communicating with buyers. All actions taken here are logged for internal auditing purposes.
              </p>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}