import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from './lib/env';
import {
  apiRateLimiter,
  authRateLimiter,
  getIdentifier,
  createRateLimitResponse,
} from './lib/rate-limit';

/**
 * Check if request path matches auth routes (stricter rate limits)
 */
function isAuthRoute(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/auth/')
  );
}

/**
 * Check if request path is an API route
 */
function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip authentication in development mode
  // Check multiple ways to detect development:
  // 1. NODE_ENV environment variable (set by Next.js)
  // 2. Hostname (localhost = dev)
  // 3. Default to dev if uncertain (safer for development)
  const nodeEnv = process.env.NODE_ENV;
  const hostname = request.nextUrl.hostname;
  const isLocalhost = hostname === 'localhost' || 
                      hostname === '127.0.0.1' ||
                      hostname.includes('localhost');
  
  // In development mode, skip all auth checks
  // This allows direct access to dashboard without login
  const isDevelopment = !nodeEnv || 
                        nodeEnv === 'development' || 
                        isLocalhost;

  // ========================================
  // RATE LIMITING (always enforced, even in dev for testing)
  // ========================================
  
  // Apply stricter rate limits to auth routes (IP-based to prevent account enumeration)
  if (isAuthRoute(pathname)) {
    const identifier = getIdentifier(request); // IP-based for auth routes
    const result = await authRateLimiter(identifier);
    
    if (!result.allowed) {
      console.warn(`[Rate Limit] Auth route blocked: ${identifier} on ${pathname}`);
      return createRateLimitResponse(result);
    }
  }
  // Apply general rate limits to API routes
  else if (isApiRoute(pathname)) {
    // For API routes, we'll use IP-based limiting in middleware
    // User-based limiting happens after auth in the route handler
    const identifier = getIdentifier(request);
    const result = await apiRateLimiter(identifier);
    
    if (!result.allowed) {
      console.warn(`[Rate Limit] API route blocked: ${identifier} on ${pathname}`);
      return createRateLimitResponse(result);
    }
  }

  // ========================================
  // DEVELOPMENT MODE: Skip auth checks
  // ========================================
  if (isDevelopment) {
    // In development, allow all routes without authentication
    return NextResponse.next();
  }

  // ========================================
  // PRODUCTION MODE: Enforce authentication
  // ========================================
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow public routes
  const publicRoutes = ['/login', '/signup', '/auth/callback'];
  const isPublicRoute = publicRoutes.includes(pathname) || 
                        pathname.startsWith('/auth/');

  // Protect dashboard routes (redirect to login if not authenticated)
  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
