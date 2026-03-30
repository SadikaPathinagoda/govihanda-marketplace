'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { productAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { CATEGORIES, DISTRICTS, UNITS, QUALITY_GRADES } from '@/lib/utils';
import { Plus, LayoutDashboard, ShoppingBag, Gavel, History } from 'lucide-react';

const navItems = [
  { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farmer/products', label: 'My Products', icon: ShoppingBag },
  { href: '/farmer/products/new', label: 'Add Product', icon: Plus },
  { href: '/farmer/bids', label: 'Bids Received', icon: Gavel },
  { href: '/farmer/transactions', label: 'Transactions', icon: History },
];

function EditProductForm() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', description: '', quantity: '',
    unit: 'kg', quality: '', expectedPrice: '', district: '',
    harvestDate: '', status: 'open',
  });

  useEffect(() => {
    productAPI.getProductById(id)
      .then((res) => {
        const p = res.data;
        setForm({
          title: p.title || '',
          category: p.category || '',
          description: p.description || '',
          quantity: p.quantity ?? '',
          unit: p.unit || 'kg',
          quality: p.quality || '',
          expectedPrice: p.expectedPrice ?? '',
          district: p.district || '',
          harvestDate: p.harvestDate ? p.harvestDate.split('T')[0] : '',
          status: p.status || 'open',
        });
      })
      .catch(() => {
        toast.error('Failed to load product');
        router.push('/farmer/products');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await productAPI.updateProduct(id, form);
      toast.success('Product updated');
      router.push('/farmer/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Farmer" navItems={navItems}>
        <div className="space-y-4">
          {['f1', 'f2', 'f3'].map((k) => <div key={k} className="card animate-pulse h-24" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Farmer" navItems={navItems}>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-700">Product Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
            <input type="text" className="input-field" value={form.title} onChange={set('title')} required />
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
            <textarea className="input-field" rows={3} value={form.description} onChange={set('description')} required />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-700">Quantity, Pricing & Status</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" className="input-field" min="0" value={form.quantity} onChange={set('quantity')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <select className="input-field" value={form.unit} onChange={set('unit')} required>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price (Rs.) *</label>
              <input type="number" className="input-field" min="0" value={form.expectedPrice} onChange={set('expectedPrice')} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Status</label>
              <select className="input-field" value={form.status} onChange={set('status')}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.push('/farmer/products')}>
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default function EditProductPage() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <EditProductForm />
    </ProtectedRoute>
  );
}
