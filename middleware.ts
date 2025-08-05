import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname;

  // Define paths that require authentication
  const protectedPaths = ['/dashboard'];
  
  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  );

  if (isProtectedPath) {
    // Check for authentication token/session
    // Since Firebase Auth tokens are handled client-side, 
    // we can check for a custom session cookie here
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      // Redirect to login page if no token found
      const loginUrl = new URL('/login', request.nextUrl.origin);
      loginUrl.searchParams.set('redirect', path); // Add redirect parameter
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow access to public pages
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
