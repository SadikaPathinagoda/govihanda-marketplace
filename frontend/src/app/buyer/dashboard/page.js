'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { bidAPI, transactionAPI } from '@/lib/api';
import Link from 'next/link';
import { ShoppingBag, Gavel, History, LayoutDashboard, Search } from 'lucide-react';

const navItems = [
  { href: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Browse Products', icon: Search },
  { href: '/buyer/bids', label: 'My Bids', icon: Gavel },
  { href: '/buyer/purchases', label: 'Purchase History', icon: History },
];

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bids: 0, transactions: 0 });

  useEffect(() => {
    Promise.all([
      bidAPI.getMyBids({ limit: 1 }),
      transactionAPI.getMyTransactions({ limit: 1 }),
    ]).then(([bidsRes, txRes]) => {
      setStats({ bids: bidsRes.data.total, transactions: txRes.data.total });
    }).catch(() => {});
  }, []);

  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <DashboardLayout title="Buyer" navItems={navItems}>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Browse products and manage your bids</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            { label: 'My Bids', value: stats.bids, icon: Gavel, color: 'text-yellow-600 bg-yellow-50', href: '/buyer/bids' },
            { label: 'Purchases', value: stats.transactions, icon: ShoppingBag, color: 'text-green-600 bg-green-50', href: '/buyer/purchases' },
          ].map((s) => (
            <Link key={s.label} href={s.href} className="card hover:shadow-md transition-shadow flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="font-bold text-gray-900">{s.value}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/marketplace" className="btn-primary flex items-center justify-center gap-2 flex-1">
              <Search className="w-4 h-4" /> Browse Marketplace
            </Link>
            <Link href="/buyer/bids" className="btn-secondary flex items-center justify-center gap-2 flex-1">
              <Gavel className="w-4 h-4" /> My Bids
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
