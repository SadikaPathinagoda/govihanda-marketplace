'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { transactionAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Users, Building2, ArrowRightLeft, BarChart3, LayoutDashboard, Star } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/providers', label: 'Provider Approvals', icon: Building2 },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/admin/market-info', label: 'Market Info', icon: BarChart3 },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
];

const statusColors = { active: 'badge-blue', completed: 'badge-green', cancelled: 'badge-red', disputed: 'badge-yellow' };

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { limit: 50 };
    if (filter) params.transactionStatus = filter;
    transactionAPI.getAllTransactions(params)
      .then((res) => setTransactions(res.data.transactions))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout title="Admin" navItems={navItems}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">All Transactions</h1>
          <select className="input-field w-40 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card animate-pulse h-14" />)}</div>
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Farmer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Buyer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{tx.product?.title}</td>
                    <td className="px-4 py-3 text-gray-500">{tx.farmer?.name}</td>
                    <td className="px-4 py-3 text-gray-500">{tx.buyer?.name}</td>
                    <td className="px-4 py-3 text-primary-700 font-semibold">{formatCurrency(tx.totalAmount)}</td>
                    <td className="px-4 py-3"><span className={`badge ${statusColors[tx.transactionStatus]}`}>{tx.transactionStatus}</span></td>
                    <td className="px-4 py-3 text-gray-400">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
