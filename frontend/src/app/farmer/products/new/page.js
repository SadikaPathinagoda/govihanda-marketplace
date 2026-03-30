'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { productAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { CATEGORIES, DISTRICTS, UNITS, QUALITY_GRADES } from '@/lib/utils';
import { Upload, Plus, LayoutDashboard, ShoppingBag, Gavel, History } from 'lucide-react';

const navItems = [
  { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farmer/products', label: 'My Products', icon: ShoppingBag },
  { href: '/farmer/products/new', label: 'Add Product', icon: Plus },
  { href: '/farmer/bids', label: 'Bids Received', icon: Gavel },
  { href: '/farmer/transactions', label: 'Transactions', icon: History },
];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    title: '', category: '', description: '', quantity: '', unit: 'kg',
    quality: '', expectedPrice: '', district: '', harvestDate: '',
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      files.forEach((f) => fd.append('images', f));
      await productAPI.createProduct(fd);
      toast.success('Product listed successfully!');
      router.push('/farmer/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <DashboardLayout title="Farmer" navItems={navItems}>
        <h1 className="text-xl font-bold text-gray-900 mb-6">List New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700">Product Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
              <input type="text" className="input-field" placeholder="e.g. Fresh Tomatoes" value={form.title} onChange={set('title')} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select className="input-field" value={form.category} onChange={set('category')} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade *</label>
                <select className="input-field" value={form.quality} onChange={set('quality')} required>
                  <option value="">Select quality</option>
                  {QUALITY_GRADES.map((q) => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea className="input-field" rows={3} placeholder="Describe your product, growing methods, freshness…" value={form.description} onChange={set('description')} required />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700">Quantity & Pricing</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input type="number" className="input-field" placeholder="100" min="0" value={form.quantity} onChange={set('quantity')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                <select className="input-field" value={form.unit} onChange={set('unit')} required>
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price (Rs.) *</label>
                <input type="number" className="input-field" placeholder="500" min="0" value={form.expectedPrice} onChange={set('expectedPrice')} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                <select className="input-field" value={form.district} onChange={set('district')} required>
                  <option value="">Select district</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                <input type="date" className="input-field" value={form.harvestDate} onChange={set('harvestDate')} />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-700 mb-3">Product Photos</h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload images (max 5)</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))} />
            </label>
            {files.length > 0 && (
              <p className="text-sm text-primary-600 mt-2">{files.length} file(s) selected</p>
            )}
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Listing Product…' : 'List Product'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
          </div>
        </form>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
