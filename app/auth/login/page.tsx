"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, User, Store } from "lucide-react"
import { toast } from "sonner"
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll"
import Footer from "@/components/landing-page/Footer"

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"buyer" | "seller">("buyer");
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // First, check if user exists with this email
      const checkEmailResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, role: loginType })
      });

      const emailCheck = await checkEmailResponse.json();
      
      if (!checkEmailResponse.ok) {
        if (emailCheck.error === 'Account suspended') {
          throw new Error('ACCOUNT_SUSPENDED');
        }
        throw new Error(emailCheck.error || 'Failed to check email');
      }

      if (!emailCheck.exists) {
        throw new Error('USER_NOT_FOUND');
      }

      // If user exists, try to sign in
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        role: loginType,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          throw new Error('INVALID_PASSWORD');
        } else if (result.error === 'Account suspended') {
          throw new Error('ACCOUNT_SUSPENDED');
        } else if (result.error === 'Invalid role') {
          throw new Error('INVALID_ROLE');
        } else {
          throw new Error('LOGIN_FAILED');
        }
      }

      toast.success(`Welcome back to Shopdotfun!`);
      
      // Redirect based on user type
      const redirectPath = loginType === 'buyer' 
        ? '/general-dashboard/buyer-dashboard/dashboard'
        : '/general-dashboard/seller-dashboard/dashboard';
      
      router.push(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases with user-friendly messages
      if (error instanceof Error) {
        console.error('Login error:', error.message);
        
        if (error.message.includes('Failed to check email')) {
          toast.error('Unable to verify your account. Please try again later.');
        } else if (error.message === 'ACCOUNT_SUSPENDED') {
          toast.error(
            <div>
              <p>Your account has been suspended.</p>
              <p>Please contact support for assistance.</p>
            </div>,
            { duration: 5000 }
          );
        } else if (error.message === 'USER_NOT_FOUND') {
          toast.error(
            <div>
              <p>No account found with this email.</p>
            </div>,
            { duration: 5000 }
          );
        } else if (error.message === 'INVALID_PASSWORD') {
          toast.error(
            <div>
              <p>Incorrect password.</p>
              <p>Please try again or <Link href="/forgot-password" className="font-medium underline">reset your password</Link> if you&apos;ve forgotten it.</p>
            </div>,
            { duration: 5000 }
          );
        } else if (error.message === 'INVALID_ROLE') {
          toast.error(`This email is not registered as a ${loginType}. Please sign in with the correct account type.`);
        } else if (error.message === 'INVALID_EMAIL_FORMAT') {
          toast.error('Please enter a valid email address.');
        } else {
          console.error('Unexpected error:', error);
          toast.error('Login failed. Please check your details and try again.');
        }
      } else {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginTypeChange = (type: "buyer" | "seller") => {
    setLoginType(type);
    // Clear form when switching between buyer and seller
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ThemeAndScroll />
      <main className="flex-grow flex items-center justify-center px-3 py-10 p-6 md:p-10 transition-colors duration-300 mb-15">
        <div className="w-full max-w-sm md:max-w-[450px] overflow-hidden">
          
          {/* Login Type Switcher */}
          <div className="flex bg-secondary/50 p-1 rounded-2xl m-6 border border-border">
            <button
              onClick={() => setLoginType("buyer")}
              className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                loginType === "buyer" 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User size={16} />
              Buyer
            </button>
            <button
              onClick={() => setLoginType("seller")}
              className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                loginType === "seller" 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Store size={16} />
              Seller
            </button>
          </div>

        <Card className="overflow-hidden bg-card border border-border rounded-3xl">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                      {loginType === "buyer" ? "Welcome back" : "Seller Portal"}
                    </h1>
                    <p className="text-balance text-muted-foreground text-sm">
                      Enter your credentials to access your {loginType} account
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      className="p-5 text-[15px] rounded-xl"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <Input 
                        id="password" 
                        name="password"
                        className="p-5 text-[15px] rounded-xl pr-12"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full p-6 text-[15px] font-bold cursor-pointer rounded-xl shadow-lg shadow-primary/20"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      `Login as ${loginType.charAt(0).toUpperCase() + loginType.slice(1)}`
                    )}
                  </Button>

                

                  <div className="text-center text-sm">
                    <p className="text-sm text-muted-foreground">
  Don&apos;t have an account?{" "}
  <Link href="/auth/register-buyer" className="text-primary hover:underline font-medium">
    Sign up
  </Link>
</p>
                    {/* <p className="text-sm text-muted-foreground">Don't have an account? <Link href="/auth/register-buyer" className="text-primary hover:underline font-medium">Sign up</Link></p> */}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking login, you agree to our{" "}
            <Link href="/landing-page/terms">Terms of Service</Link> and <Link href="/landing-page/privacy">Privacy Policy</Link>.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}