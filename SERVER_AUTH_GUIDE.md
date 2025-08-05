# Server-Side Authentication Guide

This guide explains how to implement server-side redirects and protection for Firebase Authentication in Next.js.

## Overview

There are several approaches to handle server-side authentication in Next.js with Firebase:

1. **Next.js Middleware** - Route-level protection
2. **Server Components** - Page-level protection with redirect
3. **API Route Protection** - Protect API endpoints
4. **Firebase Admin SDK** - Full server-side verification

## 1. Next.js Middleware Approach

### File: `middleware.ts` (root level)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedPaths = ['/dashboard'];
  
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  );

  if (isProtectedPath) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const loginUrl = new URL('/login', request.nextUrl.origin);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Pros:**
- Runs at the edge, very fast
- Prevents unnecessary page loads
- Works for all routes with a single configuration

**Cons:**
- Limited access to cookies and headers
- Cannot perform complex authentication logic

## 2. Server Components Approach

### Authentication Utility: `src/lib/serverAuth.ts`

```typescript
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAuth(redirectTo: string = '/login') {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token');
  
  if (!authToken) {
    redirect(redirectTo);
  }
  
  // Parse and return user data
  try {
    return JSON.parse(decodeURIComponent(authToken.value));
  } catch {
    redirect(redirectTo);
  }
}
```

### Protected Page: `src/app/dashboard/page.tsx`

```typescript
import { requireAuth } from '../../lib/serverAuth';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  // Server-side redirect if not authenticated
  const user = await requireAuth();
  
  return <DashboardClient user={user} />;
}
```

**Pros:**
- Full server-side rendering
- Can access user data on the server
- SEO-friendly
- Better perceived performance

**Cons:**
- Requires careful cookie management
- More complex setup

## 3. Cookie Management

### Setting Cookies (Client-Side)

In your AuthContext, set cookies when authentication state changes:

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setUser(user);
    
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified
      };
      
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `auth-token=${encodeURIComponent(JSON.stringify(userData))}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`;
    } else {
      document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  });
  
  return () => unsubscribe();
}, []);
```

### Reading Cookies (Server-Side)

```typescript
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token');
  
  if (!authToken) return null;
  
  try {
    return JSON.parse(decodeURIComponent(authToken.value));
  } catch {
    return null;
  }
}
```

## 4. Production Considerations

### Firebase Admin SDK (Recommended for Production)

For production applications, use Firebase Admin SDK for server-side verification:

```typescript
import { auth } from 'firebase-admin';

export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

### Secure Cookie Settings

For production, use secure cookie settings:

```typescript
const cookieOptions = process.env.NODE_ENV === 'production' 
  ? 'Secure; HttpOnly; SameSite=Strict'
  : 'SameSite=Lax';

document.cookie = `auth-token=${token}; Path=/; ${cookieOptions}`;
```

## 5. Redirect Patterns

### Redirect with Query Parameters

```typescript
// Middleware redirect with return URL
const loginUrl = new URL('/login', request.nextUrl.origin);
loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
return NextResponse.redirect(loginUrl);

// Login page handling redirect
const searchParams = useSearchParams();
const redirect = searchParams.get('redirect') || '/dashboard';

// After successful login
router.push(redirect);
```

### Conditional Redirects

```typescript
// Redirect if already authenticated
export async function redirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const user = await getCurrentUser();
  if (user) {
    redirect(redirectTo);
  }
}

// Use in login/signup pages
await redirectIfAuthenticated();
```

## 6. Testing Server-Side Protection

### Test Cases

1. **Unauthenticated Access**: Visit protected route → Should redirect to login
2. **Authenticated Access**: Login → Visit protected route → Should show content
3. **Token Expiry**: Clear cookies → Visit protected route → Should redirect
4. **Already Authenticated**: Login when already logged in → Should redirect to dashboard

### Example Test

```typescript
// Test middleware protection
test('redirects unauthenticated users', async () => {
  const response = await fetch('/dashboard');
  expect(response.redirected).toBe(true);
  expect(response.url).toContain('/login');
});
```

## 7. Best Practices

1. **Security**: Always validate tokens server-side in production
2. **Performance**: Use middleware for simple checks, server components for complex logic
3. **UX**: Provide loading states during redirects
4. **SEO**: Use server-side protection for better SEO
5. **Error Handling**: Gracefully handle token expiry and invalid tokens

## Comparison: Client vs Server Protection

| Feature | Client-Side | Server-Side |
|---------|-------------|-------------|
| **Initial Load** | Shows loading state | Immediate redirect |
| **SEO** | Poor (protected content visible) | Good (no protected content) |
| **Performance** | Additional client JS | Faster initial response |
| **Security** | Basic (client can bypass) | Strong (server enforced) |
| **Complexity** | Simple | More complex setup |

Choose server-side protection for better security and SEO, client-side for simpler setup and real-time auth state updates.
