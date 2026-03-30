'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { productAPI, bidAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MapPin, Calendar, Star, Package, Tag, Scale } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidForm, setBidForm] = useState({ bidAmount: '', quantityRequested: '', message: '' });
  const [bidLoading, setBidLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    productAPI.getProductById(id)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    setBidLoading(true);
    try {
      await bidAPI.placeBid({ productId: id, ...bidForm });
      toast.success('Bid placed successfully!');
      setBidForm({ bidAmount: '', quantityRequested: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place bid');
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading…</div></div>;
  if (!product) return <div className="text-center py-20 text-gray-400">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100">
            {product.images?.length > 0 ? (
              <Image src={product.images[activeImage].url} alt={product.title} fill className="object-cover" />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300">
                <Package className="w-16 h-16" />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? 'border-primary-500' : 'border-transparent'}`}>
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className={`badge ${product.status === 'open' ? 'badge-green' : 'badge-gray'} mb-2`}>{product.status}</span>
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-5">{product.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { icon: Tag, label: 'Category', value: product.category },
              { icon: Scale, label: 'Quality', value: product.quality },
              { icon: Package, label: 'Quantity', value: `${product.quantity} ${product.unit}` },
              { icon: MapPin, label: 'District', value: product.district },
              { icon: Calendar, label: 'Harvest Date', value: product.harvestDate ? formatDate(product.harvestDate) : 'Not specified' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
              </div>
            ))}
            <div className="bg-primary-50 rounded-lg p-3">
              <p className="text-xs text-primary-600 mb-1">Expected Price</p>
              <p className="font-bold text-primary-700">{formatCurrency(product.expectedPrice)} / {product.unit}</p>
            </div>
          </div>

          {/* Farmer info */}
          {product.farmer && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-5">
              <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                {product.farmer.name?.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">{product.farmer.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />{product.farmer.district}
                  {product.farmer.averageRating > 0 && (
                    <><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {product.farmer.averageRating}</>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bid form */}
          {user?.role === 'buyer' && product.status === 'open' && (
            <div className="card border-primary-100">
              <h3 className="font-semibold text-gray-900 mb-4">Place a Bid</h3>
              <form onSubmit={handleBid} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Bid Amount (Rs. per {product.unit})</label>
                    <input type="number" className="input-field" placeholder={product.expectedPrice} value={bidForm.bidAmount} onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })} required min="1" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Quantity ({product.unit})</label>
                    <input type="number" className="input-field" placeholder={`Max ${product.quantity}`} value={bidForm.quantityRequested} onChange={(e) => setBidForm({ ...bidForm, quantityRequested: e.target.value })} required min="1" max={product.quantity} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Message (optional)</label>
                  <textarea className="input-field" rows={2} placeholder="Any notes for the farmer…" value={bidForm.message} onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={bidLoading}>
                  {bidLoading ? 'Placing Bid…' : 'Place Bid'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
