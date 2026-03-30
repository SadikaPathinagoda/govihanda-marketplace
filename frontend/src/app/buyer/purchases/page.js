'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { transactionAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Search, Gavel, History, LayoutDashboard } from 'lucide-react';

const navItems = [
  { href: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Browse Products', icon: Search },
  { href: '/buyer/bids', label: 'My Bids', icon: Gavel },
  { href: '/buyer/purchases', label: 'Purchase History', icon: History },
];

const statusColors = { active: 'badge-blue', completed: 'badge-green', cancelled: 'badge-red', disputed: 'badge-yellow' };

export default function BuyerPurchasesPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionAPI.getMyTransactions({ limit: 50 })
      .then((res) => setTransactions(res.data.transactions))
      .catch(() => toast.error('Failed to load purchases'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <DashboardLayout title="Buyer" navItems={navItems}>
        <h1 className="text-xl font-bold text-gray-900 mb-6">Purchase History</h1>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card animate-pulse h-20" />)}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No purchases yet</div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <Link key={tx._id} href={`/transactions/${tx._id}`} className="card hover:shadow-md transition-shadow block">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{tx.product?.title}</p>
                      <span className={`badge ${statusColors[tx.transactionStatus]}`}>{tx.transactionStatus}</span>
                    </div>
                    <p className="text-sm text-gray-500">Farmer: {tx.farmer?.name} · {formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-700">{formatCurrency(tx.totalAmount)}</p>
                    <p className="text-xs text-gray-400">{tx.quantity} units @ {formatCurrency(tx.agreedPrice)}/unit</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 text-xs">
                  <span className={`badge ${tx.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'}`}>Payment: {tx.paymentStatus}</span>
                  <span className={`badge ${tx.deliveryStatus === 'delivered' ? 'badge-green' : 'badge-blue'}`}>Delivery: {tx.deliveryStatus}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
