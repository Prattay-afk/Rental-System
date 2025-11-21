import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * Server-side helper to get the current session
 * Use this in server components and API routes
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions);
}

/**
 * Server-side helper to get the current user
 * Throws error if user is not authenticated
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  
  if (!session?.user) {
    throw new Error('Not authenticated');
  }
  
  return session.user;
}

/**
 * Server-side helper to require authentication
 * Redirects to login if not authenticated
 */
export async function requireAuth(redirectTo: string = '/login') {
  const session = await getCurrentSession();
  
  if (!session) {
    redirect(redirectTo);
  }
  
  return session;
}

/**
 * Server-side helper to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session;
}

