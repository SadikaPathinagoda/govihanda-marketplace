'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, Building2, ArrowRightLeft, BarChart3, LayoutDashboard, Star } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/providers', label: 'Provider Approvals', icon: Building2 },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/admin/market-info', label: 'Market Info', icon: BarChart3 },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
];

export default function AdminReviewsPage() {
  // Note: a dedicated admin "get all ratings" endpoint could be added.
  // For now this page serves as a placeholder with a note.
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout title="Admin" navItems={navItems}>
        <h1 className="text-xl font-bold text-gray-900 mb-4">Review Moderation</h1>
        <div className="card text-center py-10 text-gray-400">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-gray-600">Review moderation</p>
          <p className="text-sm mt-1">Use GET /api/ratings/user/:id or /api/ratings/provider/:id to look up specific reviews, then moderate via the API.</p>
          <p className="text-xs text-gray-400 mt-3">A full listing UI can be added once a paginated admin ratings endpoint is implemented in the backend.</p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
