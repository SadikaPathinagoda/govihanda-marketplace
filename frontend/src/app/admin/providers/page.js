'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { providerAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { Users, Building2, ArrowRightLeft, BarChart3, LayoutDashboard, Star, Check, X } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/providers', label: 'Provider Approvals', icon: Building2 },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/admin/market-info', label: 'Market Info', icon: BarChart3 },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
];

const statusColors = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red' };

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const load = (status) => {
    setLoading(true);
    providerAPI.getAllProvidersAdmin({ approvalStatus: status, limit: 50 })
      .then((res) => setProviders(res.data.providers))
      .catch(() => toast.error('Failed to load providers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await providerAPI.approveProvider(id);
      toast.success('Provider approved');
      setProviders((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to approve provider');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Rejection reason (optional):');
    try {
      await providerAPI.rejectProvider(id, reason);
      toast.success('Provider rejected');
      setProviders((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to reject provider');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout title="Admin" navItems={navItems}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Service Provider Approvals</h1>
          <select className="input-field w-36 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card animate-pulse h-24" />)}</div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No providers found</div>
        ) : (
          <div className="space-y-4">
            {providers.map((p) => (
              <div key={p._id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{p.businessName}</h3>
                      <span className={`badge ${statusColors[p.approvalStatus]}`}>{p.approvalStatus}</span>
                      <span className="badge badge-blue capitalize">{p.serviceType.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {p.user?.name} · {p.user?.email} · {p.user?.phone}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{p.description}</p>
                    {p.coverageArea?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Coverage: {p.coverageArea.join(', ')}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Applied: {formatDate(p.createdAt)}</p>
                  </div>
                </div>

                {p.approvalStatus === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleApprove(p._id)} className="btn-primary flex items-center gap-2 text-sm py-1.5 flex-1">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleReject(p._id)} className="btn-danger flex items-center gap-2 text-sm py-1.5 flex-1">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
