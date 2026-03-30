'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { productAPI, bidAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Check, X, Star, Plus, LayoutDashboard, ShoppingBag, Gavel, History } from 'lucide-react';

const navItems = [
  { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farmer/products', label: 'My Products', icon: ShoppingBag },
  { href: '/farmer/products/new', label: 'Add Product', icon: Plus },
  { href: '/farmer/bids', label: 'Bids Received', icon: Gavel },
  { href: '/farmer/transactions', label: 'Transactions', icon: History },
];

const statusColors = { pending: 'badge-yellow', accepted: 'badge-green', rejected: 'badge-red', withdrawn: 'badge-gray' };

// Inner component reads search params — must be inside <Suspense>
function BidsContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(productId || '');
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    productAPI.getMyProducts({ status: 'open', limit: 50 }).then((res) => setProducts(res.data.products));
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    setLoading(true);
    bidAPI.getBidsForProduct(selectedProduct)
      .then((res) => setBids(res.data))
      .catch(() => toast.error('Failed to load bids'))
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  const handleAccept = async (bidId) => {
    if (!confirm('Accept this bid? The product will be marked as sold.')) return;
    try {
      await bidAPI.acceptBid(bidId);
      toast.success('Bid accepted! Transaction created.');
      setBids((prev) =>
        prev.map((b) => {
          if (b._id === bidId) return { ...b, status: 'accepted' };
          if (b.status === 'pending') return { ...b, status: 'rejected' };
          return b;
        })
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept bid');
    }
  };

  const handleReject = async (bidId) => {
    try {
      await bidAPI.rejectBid(bidId);
      toast.success('Bid rejected');
      setBids((prev) => prev.map((b) => b._id === bidId ? { ...b, status: 'rejected' } : b));
    } catch {
      toast.error('Failed to reject bid');
    }
  };

  return (
    <DashboardLayout title="Farmer" navItems={navItems}>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Bids Received</h1>

        <div className="mb-5">
          <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
          <select id="product-select" className="input-field max-w-xs" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">Choose a product…</option>
            {products.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </div>

        {selectedProduct ? (
          <>
            {loading && (
              <div className="space-y-3">
                {['s1', 's2', 's3'].map((k) => <div key={k} className="card animate-pulse h-20" />)}
              </div>
            )}
            {!loading && bids.length === 0 && (
              <div className="text-center py-12 text-gray-400">No bids yet for this product</div>
            )}
            {!loading && bids.length > 0 && (
          <div className="space-y-3">
            {bids.map((bid) => (
              <div key={bid._id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {bid.buyer?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{bid.buyer?.name}</p>
                        {bid.buyer?.averageRating > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-yellow-600">
                            <Star className="w-3 h-3 fill-current" /> {bid.buyer.averageRating}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{bid.buyer?.district} · {formatDate(bid.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`badge ${statusColors[bid.status]}`}>{bid.status}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Bid Amount</p>
                    <p className="font-bold text-green-700">{formatCurrency(bid.bidAmount)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <p className="font-bold text-blue-700">{bid.quantityRequested} units</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Total Value</p>
                    <p className="font-bold text-purple-700">{formatCurrency(bid.bidAmount * bid.quantityRequested)}</p>
                  </div>
                </div>

                {bid.message && <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3 italic">&ldquo;{bid.message}&rdquo;</p>}

                {bid.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleAccept(bid._id)} className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-1.5">
                      <Check className="w-4 h-4" /> Accept Bid
                    </button>
                    <button onClick={() => handleReject(bid._id)} className="flex-1 btn-danger flex items-center justify-center gap-2 text-sm py-1.5">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">Select a product to view its bids</div>
        )}
    </DashboardLayout>
  );
}

export default function FarmerBidsPage() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <Suspense fallback={
        <DashboardLayout title="Farmer" navItems={navItems}>
          <div className="space-y-3 pt-6">
            {['sk-1', 'sk-2', 'sk-3'].map((k) => <div key={k} className="card animate-pulse h-20" />)}
          </div>
        </DashboardLayout>
      }>
        <BidsContent />
      </Suspense>
    </ProtectedRoute>
  );
}
