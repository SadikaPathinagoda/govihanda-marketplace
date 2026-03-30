'use client';

import { useEffect, useState } from 'react';
import { productAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, DISTRICTS, QUALITY_GRADES } from '@/lib/utils';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', district: '', quality: '', search: '' });

  const fetchProducts = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12, ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await productAPI.getProducts(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
      setPage(p);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(1); }, [filters]);

  const set = (field) => (e) => setFilters({ ...filters, [field]: e.target.value });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-500 text-sm mt-1">{total} products available</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="input-field pl-9"
              placeholder="Search products…"
              value={filters.search}
              onChange={set('search')}
            />
          </div>
          <select className="input-field sm:w-40" value={filters.category} onChange={set('category')}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input-field sm:w-40" value={filters.district} onChange={set('district')}>
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="input-field sm:w-40" value={filters.quality} onChange={set('quality')}>
            <option value="">All Quality</option>
            {QUALITY_GRADES.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-64 bg-gray-50" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <SlidersHorizontal className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No products found. Try different filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => fetchProducts(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${
                page === i + 1 ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
