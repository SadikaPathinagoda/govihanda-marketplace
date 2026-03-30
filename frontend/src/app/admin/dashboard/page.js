'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { userAPI, providerAPI, transactionAPI } from '@/lib/api';
import Link from 'next/link';
import { Users, Building2, ArrowRightLeft, BarChart3, LayoutDashboard, ShoppingBag, Star } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/providers', label: 'Provider Approvals', icon: Building2 },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/admin/market-info', label: 'Market Info', icon: BarChart3 },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, pendingProviders: 0, transactions: 0 });

  useEffect(() => {
    Promise.all([
      userAPI.getAllUsers({ limit: 1 }),
      providerAPI.getAllProvidersAdmin({ approvalStatus: 'pending', limit: 1 }),
      transactionAPI.getAllTransactions({ limit: 1 }),
    ]).then(([u, p, t]) => {
      setStats({ users: u.data.total, pendingProviders: p.data.total, transactions: t.data.total });
    }).catch(() => {});
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout title="Admin" navItems={navItems}>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage GoviHanda</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600 bg-blue-50', href: '/admin/users' },
            { label: 'Pending Approvals', value: stats.pendingProviders, icon: Building2, color: 'text-yellow-600 bg-yellow-50', href: '/admin/providers' },
            { label: 'Transactions', value: stats.transactions, icon: ArrowRightLeft, color: 'text-green-600 bg-green-50', href: '/admin/transactions' },
          ].map((s) => (
            <Link key={s.label} href={s.href} className="card hover:shadow-md transition-shadow flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="font-bold text-gray-900 text-2xl">{s.value}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/admin/providers" className="card hover:shadow-md transition-shadow">
            <Building2 className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="font-semibold text-gray-900">Provider Approvals</h3>
            <p className="text-sm text-gray-500 mt-1">Review and approve service provider applications</p>
          </Link>
          <Link href="/admin/market-info" className="card hover:shadow-md transition-shadow">
            <BarChart3 className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-900">Market Information</h3>
            <p className="text-sm text-gray-500 mt-1">Add and update crop price data</p>
          </Link>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
