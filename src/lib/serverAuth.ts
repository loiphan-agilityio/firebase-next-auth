import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface ServerAuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
}

// Server-side function to get the current user
export async function getCurrentUser(): Promise<ServerAuthUser | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token');
  
  if (!authToken) {
    return null;
  }

  // In a real application, you would verify the token with Firebase Admin SDK
  // For this example, we'll decode a simple JWT-like structure
  try {
    // This is a simplified example - use Firebase Admin SDK in production
    const userData = JSON.parse(decodeURIComponent(authToken.value));
    return userData;
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return null;
  }
}

// Server-side function to require authentication
export async function requireAuth(redirectTo: string = '/login') {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect(redirectTo);
  }
  
  return user;
}

// Server-side function to redirect if already authenticated
export async function redirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const user = await getCurrentUser();
  
  if (user) {
    redirect(redirectTo);
  }
}
