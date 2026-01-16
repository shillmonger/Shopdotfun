import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

    if (isAuthPage) {
      if (isAuth) {
        // If user is already logged in, redirect to appropriate dashboard
        const redirectPath = token.role === "buyer" 
          ? "/app/general-dashboard/buyer-dashboard/dashboard" 
          : "/app/general-dashboard/seller-dashboard/dashboard";
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
      return null;
    }

    if (!isAuth) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    const isBuyerPath = req.nextUrl.pathname.startsWith("/app/general-dashboard/buyer-dashboard");
    const isSellerPath = req.nextUrl.pathname.startsWith("/app/general-dashboard/seller-dashboard");

    if ((isBuyerPath && token.role !== "buyer") || (isSellerPath && token.role !== "seller")) {
      // Redirect to appropriate dashboard based on user role
      const redirectPath = token.role === "buyer" 
        ? "/app/general-dashboard/buyer-dashboard/dashboard" 
        : "/app/general-dashboard/seller-dashboard/dashboard";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true; // This is a workaround for TypeScript, actual auth is handled above
      },
    },
  }
);

export const config = {
  matcher: [
    "/app/general-dashboard/:path*",
    "/auth/:path*",
  ],
};
