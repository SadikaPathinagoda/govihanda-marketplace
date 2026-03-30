'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { marketInfoAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { DISTRICTS } from '@/lib/utils';
import { Users, Building2, ArrowRightLeft, BarChart3, LayoutDashboard, Star, Plus, Pencil, Trash2 } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/providers', label: 'Provider Approvals', icon: Building2 },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/admin/market-info', label: 'Market Info', icon: BarChart3 },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
];

const blank = { cropName: '', district: '', averagePrice: '', unit: 'kg', demandLevel: 'medium', trend: 'stable', source: '' };

export default function AdminMarketInfoPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    marketInfoAPI.getMarketInfo()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await marketInfoAPI.updateMarketInfo(editId, form);
        toast.success('Record updated');
      } else {
        await marketInfoAPI.createMarketInfo(form);
        toast.success('Record created');
      }
      setForm(blank); setEditId(null); setShowForm(false);
      load();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({ cropName: item.cropName, district: item.district, averagePrice: item.averagePrice, unit: item.unit, demandLevel: item.demandLevel, trend: item.trend, source: item.source || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await marketInfoAPI.deleteMarketInfo(id);
      toast.success('Deleted');
      setData((prev) => prev.filter((d) => d._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout title="Admin" navItems={navItems}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Market Information</h1>
          <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(blank); }}>
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="card mb-6 space-y-4">
            <h2 className="font-semibold text-gray-700">{editId ? 'Edit Record' : 'New Record'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
                <input type="text" className="input-field" value={form.cropName} onChange={set('cropName')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                <select className="input-field" value={form.district} onChange={set('district')} required>
                  <option value="">Select district</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Average Price (Rs.) *</label>
                <input type="number" className="input-field" value={form.averagePrice} onChange={set('averagePrice')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input type="text" className="input-field" value={form.unit} onChange={set('unit')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Demand Level *</label>
                <select className="input-field" value={form.demandLevel} onChange={set('demandLevel')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trend *</label>
                <select className="input-field" value={form.trend} onChange={set('trend')}>
                  <option value="rising">Rising</option>
                  <option value="stable">Stable</option>
                  <option value="falling">Falling</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input type="text" className="input-field" placeholder="e.g. Dambulla Dedicated Economic Centre" value={form.source} onChange={set('source')} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card animate-pulse h-14" />)}</div>
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Crop</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">District</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Demand</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Trend</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.cropName}</td>
                    <td className="px-4 py-3 text-gray-500">{item.district}</td>
                    <td className="px-4 py-3 text-primary-700 font-semibold">Rs. {item.averagePrice}/{item.unit}</td>
                    <td className="px-4 py-3 capitalize">{item.demandLevel}</td>
                    <td className="px-4 py-3 capitalize">{item.trend}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button onClick={() => handleEdit(item)} className="text-gray-400 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
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
