'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { bidAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Search, Gavel, History, LayoutDashboard, X } from 'lucide-react';

const navItems = [
  { href: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Browse Products', icon: Search },
  { href: '/buyer/bids', label: 'My Bids', icon: Gavel },
  { href: '/buyer/purchases', label: 'Purchase History', icon: History },
];

const statusColors = { pending: 'badge-yellow', accepted: 'badge-green', rejected: 'badge-red', withdrawn: 'badge-gray' };

export default function BuyerBidsPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = (status = '') => {
    setLoading(true);
    const params = { limit: 50 };
    if (status) params.status = status;
    bidAPI.getMyBids(params)
      .then((res) => setBids(res.data.bids))
      .catch(() => toast.error('Failed to load bids'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleWithdraw = async (bidId) => {
    if (!confirm('Withdraw this bid?')) return;
    try {
      await bidAPI.withdrawBid(bidId);
      toast.success('Bid withdrawn');
      setBids((prev) => prev.map((b) => b._id === bidId ? { ...b, status: 'withdrawn' } : b));
    } catch {
      toast.error('Failed to withdraw bid');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <DashboardLayout title="Buyer" navItems={navItems}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Bids</h1>
          <select className="input-field w-36 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card animate-pulse h-20" />)}</div>
        ) : bids.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No bids found</p>
            <Link href="/marketplace" className="btn-primary mt-4 inline-flex">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => (
              <div key={bid._id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/marketplace/${bid.product?._id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {bid.product?.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{bid.product?.category} · {bid.product?.district}</p>
                  </div>
                  <span className={`badge ${statusColors[bid.status]}`}>{bid.status}</span>
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Bid Amount:</span>
                    <span className="font-semibold text-gray-900 ml-1">{formatCurrency(bid.bidAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Qty:</span>
                    <span className="font-semibold text-gray-900 ml-1">{bid.quantityRequested}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Total:</span>
                    <span className="font-bold text-primary-700 ml-1">{formatCurrency(bid.bidAmount * bid.quantityRequested)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">{formatDate(bid.createdAt)}</p>
                  {bid.status === 'pending' && (
                    <button onClick={() => handleWithdraw(bid._id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                      <X className="w-3.5 h-3.5" /> Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
