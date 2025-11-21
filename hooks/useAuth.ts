import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Custom hook for authentication with automatic redirect
 * @param redirectTo - Where to redirect if not authenticated (default: /login)
 * @param requireAuth - Whether to redirect if not authenticated (default: true)
 */
export function useAuth(redirectTo: string = '/login', requireAuth: boolean = true) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push(redirectTo);
    }
  }, [status, requireAuth, redirectTo, router]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
  };
}

/**
 * Hook to check if user is authenticated without redirect
 */
export function useAuthCheck() {
  const { data: session, status } = useSession();

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
  };
}

