"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { toast } from "sonner";
import {
  Camera,
  User,
  Lock,
  Bell,
  Palette,
  Moon,
  Sun,
  Shield,
  LogOut,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Mail,
  Phone
} from "lucide-react";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

export default function UserSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Derived state
  const darkMode = theme === "dark";
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "+234 801 234 5678",
  });

  // Address State
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", address: "123 Lagos Street, Ikeja, Lagos", isDefault: true },
    { id: 2, label: "Office", address: "45 Business Way, Victoria Island", isDefault: false },
  ]);

  // Form states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>("https://github.com/shadcn.png");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 pb-32">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-foreground">
                Profile & Settings
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
                  Manage your identity and preferences
                </p>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Identity & Status */}
              <div className="space-y-6">
                {/* Profile Image */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Identity
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary bg-muted shadow-2xl">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-12 h-12 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2.5 rounded-xl cursor-pointer shadow-xl border border-background hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5" />
                      </label>
                      <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </div>
                    <p className="text-sm font-black uppercase">{personalInfo.fullName}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Buyer Account</p>
                  </div>
                </div>

                {/* Account Status Card */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 opacity-5">
                    <CheckCircle2 className="w-24 h-24" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Verification</span>
                      <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-black uppercase border border-green-500/20">Verified</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Member Since</span>
                      <span className="text-xs font-black">OCT 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Trust Score</span>
                      <span className="text-xs font-black">98%</span>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
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
                
                {/* Personal Information */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" defaultValue={personalInfo.fullName} className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="email" value={personalInfo.email} readOnly className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm cursor-not-allowed opacity-70" />
                      </div>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="tel" defaultValue={personalInfo.phone} className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Book */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Address Book
                    </h3>
                    <button className="text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-primary hover:text-white transition-all cursor-pointer">
                      <Plus className="w-3 h-3" /> Add New
                    </button>
                  </div>
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="group flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary transition-all">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-2 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-black uppercase">{addr.label}</p>
                              {addr.isDefault && <span className="text-[9px] bg-foreground text-background px-1.5 py-0.5 rounded font-black">DEFAULT</span>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{addr.address}</p>
                          </div>
                        </div>
                        <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security (Password Reset) */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Security
                  </h3>
                  <form className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                      <div className="relative">
                        <input type={showCurrentPassword ? "text" : "password"} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Password</label>
                        <input type="password"  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm New</label>
                        <input type="password" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" />
                      </div>
                    </div>
                    <button type="button" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/10 cursor-pointer">
                      Update Security
                    </button>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative border-destructive/20">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-destructive">
                    <Shield className="w-4 h-4" /> Danger Zone
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl border border-destructive text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer">
                      Log out everywhere
                    </button>
                    <button className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl bg-destructive text-white hover:opacity-90 transition-all cursor-pointer">
                      Delete Account
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}