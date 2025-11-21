export { default } from 'next-auth/middleware';

// Protect these routes - users must be authenticated to access them
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - / (homepage)
     * - /login
     * - /signup
     */
    // Add protected routes here as needed
    // Example: '/dashboard/:path*', '/profile/:path*', '/bookings/:path*'
  ],
};

