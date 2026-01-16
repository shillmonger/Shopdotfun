import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// List of public paths that don't require authentication
const publicPaths = [
  "/",
  "/landing-page",
  "/landing-page/help-center",
  "/landing-page/top-stores",
  "/privacy",
  "/terms",
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isPublicPath = publicPaths.some(path => 
      req.nextUrl.pathname === path || 
      req.nextUrl.pathname.startsWith(`${path}/`)
    );

    // Allow public paths to be accessed without authentication
    if (isPublicPath) {
      return NextResponse.next();
    }

    // Handle auth pages
    if (isAuthPage) {
      if (isAuth) {
        // If user is already logged in, redirect to appropriate dashboard
        const redirectPath = token.role === "buyer" 
          ? "/general-dashboard/buyer-dashboard/dashboard" 
          : "/general-dashboard/seller-dashboard/dashboard";
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
      return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!isAuth) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access for dashboard routes
    const isBuyerPath = req.nextUrl.pathname.startsWith("/app/general-dashboard/buyer-dashboard");
    const isSellerPath = req.nextUrl.pathname.startsWith("/app/general-dashboard/seller-dashboard");

    // If user is trying to access a role-specific dashboard without the right role, redirect
    if ((isBuyerPath && token.role !== "buyer") || (isSellerPath && token.role !== "seller")) {
      const redirectPath = token.role === "buyer" 
        ? "/general-dashboard/buyer-dashboard/dashboard" 
        : "/general-dashboard/seller-dashboard/dashboard";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This is required for the middleware to work
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Match all routes except for static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
