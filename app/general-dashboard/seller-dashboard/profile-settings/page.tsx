"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
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

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  // Seller Details State
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    businessAddress: "",
  });

  // Fetch seller data
  useEffect(() => {
    const fetchSellerData = async () => {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch('/api/seller/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch seller data');
        }

        const data = await response.json();
        setBusinessInfo({
          businessName: data.businessName || "",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          country: data.country || "",
          businessAddress: data.businessAddress || "",
        });
      } catch (error) {
        console.error('Error fetching seller data:', error);
        toast.error('Failed to load seller information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerData();
  }, [session]);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>("https://github.com/shadcn.png");

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setPasswordsMatch(newPassword === confirmPassword);
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    // Validate password strength
    if (!validatePassword(newPassword)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, and number");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const response = await fetch('/api/seller/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      // Clear form on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

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
                    <p className="text-sm font-black uppercase text-center">{businessInfo.businessName || 'Your Business'}</p>
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
                      <p className="text-[10px] font-bold text-destructive flex items-center gap-1 uppercase tracking-tight">
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business Name</label>
                      <input 
                        type="text" 
                        value={businessInfo.businessName} 
                        onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Name</label>
                      <input 
                        type="text" 
                        value={businessInfo.name} 
                        onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" 
                      />
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
                        <input 
                          type="tel" 
                          value={businessInfo.phone} 
                          onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Country/Region</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          value={businessInfo.country} 
                          onChange={(e) => setBusinessInfo({...businessInfo, country: e.target.value})}
                          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          value={businessInfo.businessAddress} 
                          onChange={(e) => setBusinessInfo({...businessInfo, businessAddress: e.target.value})}
                          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-6">
                    <button 
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          setIsLoading(true);
                          const response = await fetch('/api/seller/profile', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              businessName: businessInfo.businessName,
                              name: businessInfo.name,
                              phone: businessInfo.phone,
                              country: businessInfo.country,
                              businessAddress: businessInfo.businessAddress
                            }),
                          });

                          if (!response.ok) {
                            throw new Error('Failed to update profile');
                          }

                          toast.success('Profile updated successfully');
                        } catch (error) {
                          console.error('Error updating profile:', error);
                          toast.error('Failed to update profile');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                      className="bg-foreground text-background px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Saving...' : 'Update Profile'}
                    </button>
                  </div>
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

                {/* Password & Security */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Security
                  </h3>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
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
                            required
                            minLength={8}
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Min 8 chars with uppercase, lowercase, and number
                        </p>
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
                            className={`w-full bg-muted/30 border ${
                              passwordsMatch ? 'border-border' : 'border-destructive'
                            } rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none`}
                            required
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {!passwordsMatch && (
                          <p className="text-[10px] font-bold text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> Passwords don't match
                          </p>
                        )}
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword}
                      className="bg-primary text-primary-foreground cursor-pointer px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdating ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        'Update Security'
                      )}
                    </button>
                  </form>
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