/**
 * Example component showing how to use authentication in your components
 * This file is for reference only - you can delete it if you don't need it
 */

'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthExample() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Loading state
  if (status === 'loading') {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Loading session...</p>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Not Authenticated</h2>
        <p className="text-gray-600 mb-4">
          You need to sign in to access this content.
        </p>
        <div className="space-x-2">
          <Button onClick={() => signIn()}>Sign In</Button>
          <Button
            variant="outline"
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  // Authenticated
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
      
      <div className="space-y-2 mb-4">
        <p className="text-gray-700">
          <strong>Name:</strong> {session.user.name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {session.user.email}
        </p>
        {session.user.image && (
          <div>
            <strong>Avatar:</strong>
            <img
              src={session.user.image}
              alt="Profile"
              className="w-16 h-16 rounded-full mt-2"
            />
          </div>
        )}
      </div>

      <div className="space-x-2">
        <Button onClick={() => signOut({ callbackUrl: '/' })}>
          Sign Out
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/profile')}
        >
          View Profile
        </Button>
      </div>

      {/* Session Data (for debugging) */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          View Session Data
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </details>
    </div>
  );
}

/**
 * Server Component Example
 * Create a new file for this:
 */

/*
import { getCurrentSession, requireAuth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';

// Option 1: Get session and handle manually
export default async function ServerAuthExample() {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Server Component</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}

// Option 2: Use requireAuth helper (simpler)
export default async function ServerAuthExample() {
  const session = await requireAuth(); // Redirects if not authenticated

  return (
    <div>
      <h1>Server Component</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}
*/

