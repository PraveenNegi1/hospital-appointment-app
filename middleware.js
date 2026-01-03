// middleware.js (place at project root, next to app/ folder)
import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Protected routes
  const isAdminPath = path.startsWith("/dashboard/admin");
  const isDoctorPath = path.startsWith("/dashboard/doctor");

  // Allow all other routes
  if (!isAdminPath && !isDoctorPath) {
    return NextResponse.next();
  }

  // Get userRole from cookie
  const userRoleCookie = request.cookies.get("userRole");
  const userRole = userRoleCookie ? userRoleCookie.value : null;

  // If no role, redirect to home
  if (!userRole) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Block non-admins from admin dashboard
  if (isAdminPath && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Block non-doctors from doctor dashboard
  if (isDoctorPath && userRole !== "doctor") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access
  return NextResponse.next();
}

// Apply middleware only to dashboard routes
export const config = {
  matcher: ["/dashboard/admin/:path*", "/dashboard/doctor/:path*"],
};