'use client';

import { useEffect, useState } from 'react';
import { providerAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { DISTRICTS } from '@/lib/utils';
import { Truck, Thermometer, Star, MapPin, Phone } from 'lucide-react';

const typeIcon = {
  transport: <Truck className="w-5 h-5" />,
  cold_storage: <Thermometer className="w-5 h-5" />,
  both: <Truck className="w-5 h-5" />,
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ serviceType: '', district: '' });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.serviceType) params.serviceType = filters.serviceType;
        if (filters.district) params.district = filters.district;
        const res = await providerAPI.getProviders(params);
        setProviders(res.data.providers);
      } catch {
        toast.error('Failed to load providers');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Service Providers</h1>
      <p className="text-gray-500 text-sm mb-6">Find verified transport and cold storage services</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select className="input-field sm:w-52" value={filters.serviceType} onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}>
          <option value="">All Service Types</option>
          <option value="transport">Transport</option>
          <option value="cold_storage">Cold Storage</option>
        </select>
        <select className="input-field sm:w-48" value={filters.district} onChange={(e) => setFilters({ ...filters, district: e.target.value })}>
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card animate-pulse h-44 bg-gray-50" />)}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No approved providers found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {providers.map((p) => (
            <div key={p._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
                  {typeIcon[p.serviceType]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{p.businessName}</h3>
                  <span className="badge badge-blue capitalize text-xs">{p.serviceType.replace('_', ' ')}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.description}</p>

              {p.coverageArea?.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  {p.coverageArea.slice(0, 3).join(', ')}
                  {p.coverageArea.length > 3 && ` +${p.coverageArea.length - 3} more`}
                </div>
              )}

              {p.contactPhone && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Phone className="w-3 h-3" /> {p.contactPhone}
                </div>
              )}

              {p.averageRating > 0 && (
                <div className="flex items-center gap-1 text-xs text-yellow-600 border-t border-gray-50 pt-3">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {p.averageRating} ({p.totalRatings} reviews)
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
