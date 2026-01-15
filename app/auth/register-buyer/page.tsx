"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll"
import Footer from "@/components/landing-page/Footer"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("You must accept the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    // Logic for handling the cleaned data goes here
    console.log("Form Submitted:", formData);
    
    setTimeout(() => {
        setIsLoading(false);
        toast.success("Account created successfully!");
    }, 1500);
  };

  return (
    <div className="flex px-3 py-10 min-h-screen flex-col items-center justify-center bg-background text-foreground p-6 md:p-10 transition-colors duration-300">
      <ThemeAndScroll />

      <div className="w-full max-w-sm md:max-w-[500px] overflow-hidden mb-20">
        <Card className="overflow-hidden bg-card border border-border rounded-3xl">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-3xl font-black italic uppercase tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                    Create Account
                  </h1>
                  {/* <h1 className="text-2xl font-bold">Create your account</h1> */}
                  <p className="text-balance text-muted-foreground">
                    Enter your details below to join Shopdotfun
                  </p>
                </div>

                {/* Full Name */}
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="p-5 text-[15px]"
                    placeholder="John Doe"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="p-5 text-[15px]"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Phone Number */}
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="p-5 text-[15px]"
                    placeholder="+234 ..."
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Country */}
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    className="p-5 text-[15px]"
                    placeholder="Nigeria"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
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
                      className="pr-10 p-5 text-[15px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                      className="pr-10 p-5 text-[15px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>

                {/* Accept Terms */}
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox 
                    id="terms" 
                    checked={formData.acceptTerms}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the <Link href="/terms" className="text-primary underline">Terms & Conditions</Link>
                  </label>
                </div>

                <Button type="submit" className="w-full cursor-pointer p-6 text-[15px] font-semibold rounded-xl" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Create Account"}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4 font-bold text-primary">
                    Sign in
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