'use client';

import { useEffect, useState } from 'react';
import { marketInfoAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { DISTRICTS } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

const trendIcon = {
  rising: <TrendingUp className="w-4 h-4 text-green-600" />,
  falling: <TrendingDown className="w-4 h-4 text-red-500" />,
  stable: <Minus className="w-4 h-4 text-yellow-500" />,
};

const demandColor = {
  high: 'badge-green',
  medium: 'badge-yellow',
  low: 'badge-red',
};

export default function MarketInfoPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('');
  const [crop, setCrop] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (district) params.district = district;
        if (crop) params.cropName = crop;
        const res = await marketInfoAPI.getMarketInfo(params);
        setData(res.data);
      } catch {
        toast.error('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [district, crop]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Market Prices</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">Latest agricultural crop prices across Sri Lanka</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" className="input-field sm:w-56" placeholder="Search crop name…" value={crop} onChange={(e) => setCrop(e.target.value)} />
        <select className="input-field sm:w-48" value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card animate-pulse h-28 bg-gray-50" />)}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No market data found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.cropName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.district}</p>
                </div>
                <span className={`badge ${demandColor[item.demandLevel]}`}>{item.demandLevel} demand</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary-700">Rs. {item.averagePrice}</p>
                  <p className="text-xs text-gray-400">per {item.unit || 'kg'}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  {trendIcon[item.trend]}
                  <span className={item.trend === 'rising' ? 'text-green-600' : item.trend === 'falling' ? 'text-red-500' : 'text-yellow-600'}>
                    {item.trend}
                  </span>
                </div>
              </div>
              {item.source && <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">Source: {item.source}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
