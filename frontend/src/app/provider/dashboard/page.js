'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { providerAPI } from '@/lib/api';
import Link from 'next/link';
import { LayoutDashboard, Building2, Settings, Clock } from 'lucide-react';

const navItems = [
  { href: '/provider/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/provider/register', label: 'Business Profile', icon: Building2 },
  { href: '/provider/services', label: 'Manage Services', icon: Settings },
];

const statusColors = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red' };

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    providerAPI.getMyProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <DashboardLayout title="Provider" navItems={navItems}>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your service provider profile</p>
        </div>

        {loading ? (
          <div className="card animate-pulse h-32" />
        ) : !profile ? (
          <div className="card text-center py-10">
            <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h2 className="font-semibold text-gray-700 mb-2">No Provider Profile Yet</h2>
            <p className="text-sm text-gray-500 mb-5">Register your business to appear in the service directory</p>
            <Link href="/provider/register" className="btn-primary inline-flex">Register Business</Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{profile.businessName}</h2>
                  <p className="text-sm text-gray-500 mt-1 capitalize">{profile.serviceType.replace('_', ' ')}</p>
                </div>
                <span className={`badge ${statusColors[profile.approvalStatus]}`}>{profile.approvalStatus}</span>
              </div>

              {profile.approvalStatus === 'pending' && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2 text-sm text-yellow-700">
                  <Clock className="w-4 h-4 shrink-0" />
                  Your profile is under review. You will be notified once approved.
                </div>
              )}

              {profile.approvalStatus === 'rejected' && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  <p className="font-medium mb-1">Profile rejected</p>
                  {profile.rejectionReason && <p>{profile.rejectionReason}</p>}
                </div>
              )}

              {profile.approvalStatus === 'approved' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  Your profile is live and visible to farmers and buyers.
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-3">Profile Details</h3>
              <p className="text-sm text-gray-600">{profile.description}</p>
              {profile.coverageArea?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Coverage Areas:</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.coverageArea.map((a) => <span key={a} className="badge badge-blue">{a}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
