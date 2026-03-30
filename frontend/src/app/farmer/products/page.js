'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { productAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Pencil, Trash2, Package, LayoutDashboard, ShoppingBag, Gavel, History } from 'lucide-react';

const navItems = [
  { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farmer/products', label: 'My Products', icon: ShoppingBag },
  { href: '/farmer/products/new', label: 'Add Product', icon: Plus },
  { href: '/farmer/bids', label: 'Bids Received', icon: Gavel },
  { href: '/farmer/transactions', label: 'Transactions', icon: History },
];

const statusColors = { open: 'badge-green', sold: 'badge-gray', closed: 'badge-red' };

export default function FarmerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    productAPI.getMyProducts({ limit: 50 })
      .then((res) => setProducts(res.data.products))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.deleteProduct(id);
      toast.success('Product removed');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await productAPI.updateProduct(id, { status });
      toast.success('Status updated');
      setProducts((prev) => prev.map((p) => p._id === id ? { ...p, status } : p));
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <DashboardLayout title="Farmer" navItems={navItems}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Products</h1>
          <Link href="/farmer/products/new" className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {['sk-1', 'sk-2', 'sk-3', 'sk-4'].map((k) => <div key={k} className="card animate-pulse h-20 bg-gray-50" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No products yet.</p>
            <Link href="/farmer/products/new" className="btn-primary mt-4 inline-flex">List your first product</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="card flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {p.images?.[0] ? (
                    <Image src={p.images[0].url} alt={p.title} fill className="object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-300">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>
                    <span className={`badge ${statusColors[p.status]}`}>{p.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">{p.category} · {p.quantity} {p.unit} · {formatCurrency(p.expectedPrice)}/{p.unit}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Listed {formatDate(p.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="sold">Sold</option>
                  </select>
                  <Link href={`/farmer/products/${p._id}/edit`} className="p-2 text-gray-400 hover:text-primary-600">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link href={`/farmer/bids?product=${p._id}`} className="text-xs text-primary-600 hover:underline">
                    View Bids
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
