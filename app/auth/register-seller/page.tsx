"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Store, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll"
import Footer from "@/components/landing-page/Footer"

export default function SellerSignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    businessName: "",
    businessAddress: "",
    acceptAgreement: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear password error when typing
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError("");
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptAgreement: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.acceptAgreement) {
      toast.error("Please accept the Seller Agreement to continue");
      return;
    }

    setIsLoading(true);

    try {
      // Register the seller
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'seller',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto-login after registration
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        role: 'seller',
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Account created successfully! Redirecting to your seller dashboard...');
      router.push('/general-dashboard/seller-dashboard/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex px-3 py-10 min-h-screen flex-col items-center justify-center bg-background text-foreground p-6 md:p-10 transition-colors duration-300">
      <ThemeAndScroll />

      <div className="w-full max-w-md md:max-w-[500px] overflow-hidden mb-20 mt-10">
        <Card className="overflow-hidden bg-card border border-border rounded-3xl">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="p-6 md:p-10">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-3xl font-black italic uppercase tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                  Seller Central
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Open your store and start reaching millions of customers
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      placeholder="e.g. Shopdotfun Electronics"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="p-5"
                    />
                  </div>

                  {/* Owner Full Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Owner Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="p-5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="vendor@shopdot.fun"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="p-5"
                    />
                  </div>

                  {/* Phone */}
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234 ..."
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="p-5"
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Nigeria"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="p-5"
                  />
                </div>

                {/* Business Address */}
                <div className="grid gap-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    name="businessAddress"
                    placeholder="Physical store or office location"
                    required
                    value={formData.businessAddress}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="rounded-xl min-h-[80px]"
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Create Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => {
                        handleChange(e);
                        if (confirmPassword && e.target.value !== confirmPassword) {
                          setPasswordError("Passwords do not match");
                        } else {
                          setPasswordError("");
                        }
                      }}
                      disabled={isLoading}
                      className="pr-10 p-5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (formData.password !== e.target.value) {
                          setPasswordError("Passwords do not match");
                        } else {
                          setPasswordError("");
                        }
                      }}
                      disabled={isLoading}
                      className="pr-10 p-5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>

                {/* Accept Agreement */}
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox 
                    id="agreement" 
                    checked={formData.acceptAgreement}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="agreement"
                    className="text-sm font-medium leading-tight cursor-pointer"
                  >
                    I agree to the <Link href="/landing-page/terms" className="text-primary underline">Shopdotfun Seller Agreement</Link>
                  </label>
                </div>

                <Button type="submit" className="w-full p-6 text-base font-bold cursor-pointer rounded-2xl shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Setting up store..." : "Register as Seller"}
                </Button>

                <div className="text-center text-sm">
                  Already a seller?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4 font-bold text-primary">
                    Login to Dashboard
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

            <Footer />
    </div>
  );
}