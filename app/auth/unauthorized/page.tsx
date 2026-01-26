"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ShieldX, ArrowLeft, Home, User, Store } from "lucide-react"
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll"
import Footer from "@/components/landing-page/Footer"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ThemeAndScroll />
      <main className="flex-grow flex items-center justify-center px-3 py-10 p-6 md:p-10 transition-colors duration-300 mb-20">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden bg-card border border-border rounded-3xl shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div className="w-20 h-20 bg-red-400/10 rounded-2xl flex items-center justify-center">
                  <ShieldX className="w-10 h-10 text-red-500" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-wider hover:text-primary transition-colors bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                    Access Denied
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    You don't have permission to access this page
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    This area is restricted to administrators only. If you believe this is an error, please contact support or try logging in with the appropriate account.
                  </p>
                </div>

               {/* Action Buttons */}
<div className="w-full space-y-3">
  {/* Dashboard Row: Forced 2 columns, Icons hidden on mobile */}
  <div className="grid grid-cols-2 gap-3">
    <Button 
      variant="ghost" 
      asChild 
      className="h-12 bg-secondary/40 hover:bg-primary/10 border border-border/40 rounded-2xl transition-all duration-300 group"
    >
      <Link href="/general-dashboard/buyer-dashboard/dashboard" className="flex items-center justify-center">
        <User className="hidden sm:block w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest sm:tracking-tighter">
          Buyer
        </span>
      </Link>
    </Button>
    
    <Button 
      variant="ghost" 
      asChild 
      className="h-12 bg-secondary/40 hover:bg-primary/10 border border-border/40 rounded-2xl transition-all duration-300 group"
    >
      <Link href="/general-dashboard/seller-dashboard/dashboard" className="flex items-center justify-center">
        <Store className="hidden sm:block w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest sm:tracking-tighter">
          Seller
        </span>
      </Link>
    </Button>
  </div>

  {/* Auth/Home Row: Forced 2 columns, Icons hidden on mobile */}
  <div className="grid grid-cols-2 gap-3">
    <Button 
      asChild 
      className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
    >
      <Link href="/auth/login" className="flex items-center justify-center">
        <User className="hidden sm:block w-4 h-4 mr-2" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest sm:tracking-tighter">
          Sign In
        </span>
      </Link>
    </Button>
    
    <Button 
      variant="outline" 
      asChild 
      className="h-12 border-2 border-border hover:bg-muted rounded-2xl transition-all active:scale-95"
    >
      <Link href="/" className="flex items-center justify-center">
        <Home className="hidden sm:block w-4 h-4 mr-2" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest sm:tracking-tighter">
          Home
        </span>
      </Link>
    </Button>
  </div>
</div>

                {/* Help Text */}
                <div className="text-xs text-muted-foreground border-t pt-4 w-full">
                  <p>
                    Need help? Contact our support team or check your account permissions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
