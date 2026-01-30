import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt';

// List of public paths that don't require authentication
const publicPaths = [
  "/",
  "/landing-page",
  "/landing-page/help-center",
  "/landing-page/top-stores",
  "/privacy",
  "/terms",
  "/api/auth",
];

// List of API routes that require authentication
const protectedApiRoutes = [
  "/api/seller/products",
  "/api/buyer/orders",
  "/api/buyer/orders/update-status",
  "/api/seller/orders",
  "/api/seller/orders/update-status",
  "/api/admin/orders",
  "/api/admin/orders/update-status"
];

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const isPublicPath = publicPaths.some(path => 
      req.nextUrl.pathname === path || 
      req.nextUrl.pathname.startsWith(`${path}/`)
    );

    // Allow public paths to be accessed without authentication
    if (isPublicPath) {
      return NextResponse.next();
    }

    // Allow all auth page access (login, register, logout)
    // These are now handled by the publicPaths check above
    if (isAuthPage) {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated and trying to access protected route
    if (!isAuth) {
      // Skip redirect for public paths and API routes
      if (!isPublicPath && !isApiRoute) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    // Check role-based access for dashboard routes and API routes
    const isBuyerPath = req.nextUrl.pathname.startsWith("/general-dashboard/buyer-dashboard");
    const isSellerPath = req.nextUrl.pathname.startsWith("/general-dashboard/seller-dashboard");
    const isAdminPath = req.nextUrl.pathname.startsWith("/general-dashboard/admin-dashboard");
    
    // Check API route access
    const isBuyerApi = req.nextUrl.pathname.startsWith("/api/buyer/orders");
    const isSellerApi = req.nextUrl.pathname.startsWith("/api/seller/orders");
    const isAdminApi = req.nextUrl.pathname.startsWith("/api/admin/orders");

    // Get user roles from token
    const userRoles = token.roles || [];

    // Check admin access
    if ((isAdminPath || isAdminApi) && !userRoles.includes('admin')) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // Check seller access
    if ((isSellerPath || isSellerApi) && !userRoles.includes('seller') && !userRoles.includes('admin')) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // Check buyer access
    if ((isBuyerPath || isBuyerApi) && !userRoles.includes('buyer') && !userRoles.includes('admin')) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (auth routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};