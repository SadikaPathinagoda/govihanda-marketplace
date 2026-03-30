'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { userAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { Users, Building2, ArrowRightLeft, BarChart3, LayoutDashboard, Star, UserCheck, UserX } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/providers', label: 'Provider Approvals', icon: Building2 },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/admin/market-info', label: 'Market Info', icon: BarChart3 },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
];

const roleColors = { farmer: 'badge-green', buyer: 'badge-blue', provider: 'badge-yellow', admin: 'badge-red' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  const load = (role = '') => {
    setLoading(true);
    const params = { limit: 100 };
    if (role) params.role = role;
    userAPI.getAllUsers(params)
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(roleFilter); }, [roleFilter]);

  const toggleStatus = async (id, current) => {
    try {
      await userAPI.setUserStatus(id, !current);
      toast.success(`User ${!current ? 'activated' : 'deactivated'}`);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: !current } : u));
    } catch {
      toast.error('Failed to update user status');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout title="Admin" navItems={navItems}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <select className="input-field w-36 text-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="farmer">Farmers</option>
            <option value="buyer">Buyers</option>
            <option value="provider">Providers</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card animate-pulse h-14" />)}</div>
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">District</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3"><span className={`badge ${roleColors[u.role]}`}>{u.role}</span></td>
                    <td className="px-4 py-3 text-gray-500">{u.district || '-'}</td>
                    <td className="px-4 py-3 text-gray-400">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(u._id, u.isActive)}
                        className={`flex items-center gap-1 text-xs font-medium ${u.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}
                      >
                        {u.isActive ? <><UserX className="w-3.5 h-3.5" /> Deactivate</> : <><UserCheck className="w-3.5 h-3.5" /> Activate</>}
                      </button>
                    </td>
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
