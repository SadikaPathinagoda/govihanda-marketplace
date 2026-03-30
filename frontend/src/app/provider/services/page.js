'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { providerAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { DISTRICTS } from '@/lib/utils';
import Link from 'next/link';
import { LayoutDashboard, Building2, Settings, CheckCircle, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';

const navItems = [
  { href: '/provider/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/provider/register', label: 'Business Profile', icon: Building2 },
  { href: '/provider/services', label: 'Manage Services', icon: Settings },
];

export default function ProviderServicesPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    pricingDetails: '',
    coverageArea: [],
    isAvailable: true,
    vehicleDetails: { vehicleType: '', vehicleCount: '', capacity: '' },
    storageCapacity: { totalCapacity: '', unit: 'kg', temperatureRange: '' },
  });

  useEffect(() => {
    providerAPI.getMyProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          pricingDetails: res.data.pricingDetails || '',
          coverageArea: res.data.coverageArea || [],
          isAvailable: res.data.isAvailable ?? true,
          vehicleDetails: res.data.vehicleDetails || { vehicleType: '', vehicleCount: '', capacity: '' },
          storageCapacity: res.data.storageCapacity || { totalCapacity: '', unit: 'kg', temperatureRange: '' },
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleDistrict = (d) =>
    setForm((f) => ({
      ...f,
      coverageArea: f.coverageArea.includes(d)
        ? f.coverageArea.filter((x) => x !== d)
        : [...f.coverageArea, d],
    }));

  const setVehicle = (field) => (e) =>
    setForm((f) => ({ ...f, vehicleDetails: { ...f.vehicleDetails, [field]: e.target.value } }));

  const setStorage = (field) => (e) =>
    setForm((f) => ({ ...f, storageCapacity: { ...f.storageCapacity, [field]: e.target.value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await providerAPI.updateProvider(profile._id, form);
      toast.success('Services updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['provider']}>
        <DashboardLayout title="Provider" navItems={navItems}>
          <div className="space-y-4">
            {['s1', 's2'].map((k) => <div key={k} className="card animate-pulse h-24" />)}
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute allowedRoles={['provider']}>
        <DashboardLayout title="Provider" navItems={navItems}>
          <div className="card text-center py-10">
            <Settings className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-gray-700 mb-2">No provider profile found</p>
            <Link href="/provider/register" className="btn-primary inline-flex mt-2">Register Business First</Link>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const showTransport = profile.serviceType === 'transport' || profile.serviceType === 'both';
  const showStorage = profile.serviceType === 'cold_storage' || profile.serviceType === 'both';

  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <DashboardLayout title="Provider" navItems={navItems}>
        <h1 className="text-xl font-bold text-gray-900 mb-6">Manage Services</h1>

        {/* Availability toggle */}
        <div className="card flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-900">Service Availability</p>
            <p className="text-sm text-gray-500 mt-0.5">Toggle whether you are currently accepting new jobs</p>
          </div>
          <button
            onClick={() => setForm((f) => ({ ...f, isAvailable: !f.isAvailable }))}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              form.isAvailable
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {form.isAvailable
              ? <><ToggleRight className="w-5 h-5" /> Available</>
              : <><ToggleLeft className="w-5 h-5" /> Unavailable</>
            }
          </button>
        </div>

        {/* Pricing */}
        <div className="card mb-4">
          <h2 className="font-semibold text-gray-700 mb-3">Pricing Details</h2>
          <textarea
            className="input-field"
            rows={3}
            placeholder="e.g. Rs. 50/km, min 20 km. Cold storage: Rs. 2/kg/day."
            value={form.pricingDetails}
            onChange={(e) => setForm({ ...form, pricingDetails: e.target.value })}
          />
        </div>

        {/* Vehicle details */}
        {showTransport && (
          <div className="card mb-4 space-y-3">
            <h2 className="font-semibold text-gray-700">Vehicle Details</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Vehicle Type</label>
                <input type="text" className="input-field" placeholder="e.g. Lorry, Van" value={form.vehicleDetails.vehicleType} onChange={setVehicle('vehicleType')} />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Number of Vehicles</label>
                <input type="number" className="input-field" min="1" value={form.vehicleDetails.vehicleCount} onChange={setVehicle('vehicleCount')} />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Capacity</label>
                <input type="text" className="input-field" placeholder="e.g. 5 tons" value={form.vehicleDetails.capacity} onChange={setVehicle('capacity')} />
              </div>
            </div>
          </div>
        )}

        {/* Storage capacity */}
        {showStorage && (
          <div className="card mb-4 space-y-3">
            <h2 className="font-semibold text-gray-700">Storage Capacity</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Total Capacity</label>
                <input type="text" className="input-field" placeholder="e.g. 500" value={form.storageCapacity.totalCapacity} onChange={setStorage('totalCapacity')} />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Unit</label>
                <input type="text" className="input-field" placeholder="kg / tons" value={form.storageCapacity.unit} onChange={setStorage('unit')} />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Temperature Range</label>
                <input type="text" className="input-field" placeholder="e.g. 0°C – 10°C" value={form.storageCapacity.temperatureRange} onChange={setStorage('temperatureRange')} />
              </div>
            </div>
          </div>
        )}

        {/* Coverage areas */}
        <div className="card mb-5">
          <h2 className="font-semibold text-gray-700 mb-3">Coverage Areas</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {DISTRICTS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDistrict(d)}
                className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-colors ${
                  form.coverageArea.includes(d)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Approval status notice */}
        {profile.approvalStatus !== 'approved' && (
          <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <XCircle className="w-4 h-4 shrink-0" />
            Your profile is <strong>{profile.approvalStatus}</strong>. Changes will take effect once approved.
          </div>
        )}
        {profile.approvalStatus === 'approved' && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Your profile is live. Updates are applied immediately.
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save Service Settings'}
        </button>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
