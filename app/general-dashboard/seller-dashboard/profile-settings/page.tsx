"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { 
  Camera, 
  Lock, 
  Palette, 
  Moon, 
  Sun, 
  Shield, 
  Eye, 
  EyeOff, 
  Building2, 
  Mail, 
  Phone,
  Upload,
  AlertCircle,
  FileText,
  Globe,
  MapPin
} from "lucide-react";

import { toast } from "sonner";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

export default function SellerProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";

  // Verification Status State
  const [verificationStatus, setVerificationStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");

  // Seller Details State
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Elite Gear Hub",
    ownerName: "Alex Johnson",
    email: "alex.j@elitegear.com",
    phone: "+234 801 234 5678",
    country: "Nigeria",
    address: "123 Business Plaza, Ikeja, Lagos",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>("https://github.com/shadcn.png");

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = () => {
    toast.success("Verification Submitted", {
      description: "Admin will review your documents within 48 hours.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 pb-32">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-foreground">
                Seller Identity
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
                  Business Profile & Verification Control
                </p>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Status & Branding */}
              <div className="space-y-6">
                {/* Store Identity */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> Identity
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary bg-muted shadow-2xl">
                        {profileImage ? (
                          <img src={profileImage} alt="Store" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-12 h-12 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2.5 rounded-xl cursor-pointer shadow-xl border border-background hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5" />
                      </label>
                      <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </div>
                    <p className="text-sm font-black uppercase">{businessInfo.businessName}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Verified Merchant</p>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative">
                   <div className="absolute -right-4 -top-4 opacity-5">
                    <Shield className="w-24 h-24" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4">Approval Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Current State</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase border ${
                        verificationStatus === "Approved" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        verificationStatus === "Pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-destructive/10 text-destructive border-destructive/20"
                      }`}>
                        {verificationStatus}
                      </span>
                    </div>
                    {verificationStatus === "Rejected" && (
                      <p className="text-[10px] text-destructive font-bold uppercase leading-tight bg-destructive/5 p-2 rounded-lg">
                        Reason: Blurred document images. Please re-upload.
                      </p>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Last Update</span>
                      <span className="text-xs font-black uppercase">Today</span>
                    </div>
                  </div>
                </div>

                {/* Appearance - Same as Buyer */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Dark Mode</p>
                    <button 
                      onClick={toggleTheme} 
                      className={`relative w-14 h-8 rounded-full cursor-pointer border border-border transition-colors ${darkMode ? "bg-primary" : "bg-muted"}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${darkMode ? "translate-x-6" : "translate-x-1"}`}>
                        {darkMode ? <Moon className="w-3.5 h-3.5 text-black" /> : <Sun className="w-3.5 h-3.5 text-yellow-500" />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Business Information */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> Business Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Store Name</label>
                      <input type="text" defaultValue={businessInfo.businessName} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Owner Name</label>
                      <input type="text" defaultValue={businessInfo.ownerName} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="email" value={businessInfo.email} readOnly className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm cursor-not-allowed opacity-70" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="tel" defaultValue={businessInfo.phone} className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                      </div>
                    </div>
                    {/* Added Country */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Country</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" defaultValue={businessInfo.country} className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                      </div>
                    </div>
                    {/* Added Business Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" defaultValue={businessInfo.address} className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                      </div>
                    </div>
                  </div>
                  <button className="mt-6 bg-foreground text-background px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer">
                    Update Profile
                  </button>
                </div>

                {/* Verification Documents */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Verification documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-all cursor-pointer group">
                      <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Government ID</p>
                    </div>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-all cursor-pointer group">
                      <FileText className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Utility Bill</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Payout Bank Account</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* Added Account Name */}
                       <div className="md:col-span-2">
                        <input type="text" placeholder="Account Holder Name" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                       </div>
                       <input type="text" placeholder="Bank Name" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                       <input type="text" placeholder="Account Number" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmitVerification}
                    className="mt-6 w-full bg-primary text-primary-foreground py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/10 hover:opacity-90 transition-all"
                  >
                    Submit for Review
                  </button>
                </div>

                {/* Password & Security - Matches Buyer Layout */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Security
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? "text" : "password"} 
                          className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" 
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Password</label>
                        <div className="relative">
                          <input 
                            type={showNewPassword ? "text" : "password"} 
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setPasswordsMatch(e.target.value === confirmPassword);
                            }}
                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" 
                          />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm New</label>
                        <div className="relative">
                          <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setPasswordsMatch(newPassword === e.target.value);
                            }}
                            className={`w-full bg-muted/30 border ${passwordsMatch ? 'border-border' : 'border-destructive'} rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none`} 
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    {!passwordsMatch && (
                      <p className="text-[10px] font-bold text-destructive flex items-center gap-1 uppercase tracking-tight">
                        <AlertCircle className="w-3 h-3" /> Passwords don't match
                      </p>
                    )}
                    <button 
                      disabled={!passwordsMatch || !newPassword}
                      className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
                    >
                      Update Security
                    </button>
                  </div>
                </div>

                {/* Danger Zone - Same as Buyer */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative border-destructive/20">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-destructive">
                    <Shield className="w-4 h-4" /> Danger Zone
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl border border-destructive text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer">
                      Log out everywhere
                    </button>
                    <button className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl bg-destructive text-white hover:opacity-90 transition-all cursor-pointer">
                      Delete Store
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}