'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { productAPI, bidAPI, transactionAPI } from '@/lib/api';
import Link from 'next/link';
import { Package, Gavel, ArrowRightLeft, Plus, LayoutDashboard, ShoppingBag, History } from 'lucide-react';

const navItems = [
  { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farmer/products', label: 'My Products', icon: ShoppingBag },
  { href: '/farmer/products/new', label: 'Add Product', icon: Plus },
  { href: '/farmer/bids', label: 'Bids Received', icon: Gavel },
  { href: '/farmer/transactions', label: 'Transactions', icon: History },
];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, openBids: 0, transactions: 0 });

  useEffect(() => {
    Promise.all([
      productAPI.getMyProducts({ limit: 1 }),
      transactionAPI.getMyTransactions({ limit: 1 }),
    ]).then(([prodRes, txRes]) => {
      setStats((s) => ({ ...s, products: prodRes.data.total, transactions: txRes.data.total }));
    }).catch(() => {});
  }, []);

  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <DashboardLayout title="Farmer" navItems={navItems}>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your products and bids</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'My Products', value: stats.products, icon: Package, color: 'text-blue-600 bg-blue-50', href: '/farmer/products' },
            { label: 'Bid Requests', value: 'View', icon: Gavel, color: 'text-yellow-600 bg-yellow-50', href: '/farmer/bids' },
            { label: 'Transactions', value: stats.transactions, icon: ArrowRightLeft, color: 'text-green-600 bg-green-50', href: '/farmer/transactions' },
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
            <Link href="/farmer/products/new" className="btn-primary flex items-center justify-center gap-2 flex-1">
              <Plus className="w-4 h-4" /> List New Product
            </Link>
            <Link href="/farmer/bids" className="btn-secondary flex items-center justify-center gap-2 flex-1">
              <Gavel className="w-4 h-4" /> View Bid Requests
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
