"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/authContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run redirect logic after auth state has finished loading
    if (!loading) {
      if (!user) {
        // Not logged in → redirect to login
        router.replace('/auth/login');
      } else if (role && !allowedRoles.includes(role)) {
        // Logged in, but wrong role → redirect to home
        router.replace('/');
      }
    }
  }, [loading, user, role, router, allowedRoles]);

  // While loading auth state → show loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or wrong role → show nothing (redirect is already happening)
  if (!user || (role && !allowedRoles.includes(role))) {
    return null;
  }

  // All checks passed → render children
  return <>{children}</>;
}