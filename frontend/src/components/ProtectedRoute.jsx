'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Leaf } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.replace('/unauthorized');
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-primary-600">
          <Leaf className="w-8 h-8 animate-pulse" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) return null;

  return children;
}
