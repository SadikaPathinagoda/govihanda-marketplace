'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { providerAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { DISTRICTS } from '@/lib/utils';
import { LayoutDashboard, Building2, Settings } from 'lucide-react';

const navItems = [
  { href: '/provider/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/provider/register', label: 'Business Profile', icon: Building2 },
  { href: '/provider/services', label: 'Manage Services', icon: Settings },
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState(null);
  const [form, setForm] = useState({
    businessName: '', serviceType: 'transport', description: '',
    contactPhone: '', contactEmail: '', pricingDetails: '',
    coverageArea: [],
  });

  useEffect(() => {
    providerAPI.getMyProfile()
      .then((res) => { setExistingId(res.data._id); setForm(res.data); })
      .catch(() => {});
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const toggleDistrict = (d) => {
    setForm((f) => ({
      ...f,
      coverageArea: f.coverageArea.includes(d)
        ? f.coverageArea.filter((x) => x !== d)
        : [...f.coverageArea, d],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (existingId) {
        await providerAPI.updateProvider(existingId, form);
        toast.success('Profile updated');
      } else {
        await providerAPI.registerProvider(form);
        toast.success('Profile submitted for approval!');
      }
      router.push('/provider/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <DashboardLayout title="Provider" navItems={navItems}>
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {existingId ? 'Update Business Profile' : 'Register Your Business'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700">Business Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
              <input type="text" className="input-field" placeholder="e.g. Perera Transport Services" value={form.businessName} onChange={set('businessName')} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'transport', label: 'Transport' },
                  { value: 'cold_storage', label: 'Cold Storage' },
                  { value: 'both', label: 'Both' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, serviceType: opt.value })}
                    className={`py-2 rounded-xl border-2 text-sm font-medium transition-colors ${form.serviceType === opt.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea className="input-field" rows={3} placeholder="Describe your services, experience, capacity…" value={form.description} onChange={set('description')} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input type="tel" className="input-field" value={form.contactPhone} onChange={set('contactPhone')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input type="email" className="input-field" value={form.contactEmail} onChange={set('contactEmail')} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Details</label>
              <textarea className="input-field" rows={2} placeholder="e.g. Rs. 50 per km, minimum 20 km" value={form.pricingDetails} onChange={set('pricingDetails')} />
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-700 mb-3">Coverage Areas</h2>
            <p className="text-xs text-gray-500 mb-3">Select all districts you serve</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {DISTRICTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDistrict(d)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-colors ${form.coverageArea?.includes(d) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving…' : existingId ? 'Update Profile' : 'Submit for Approval'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
          </div>
        </form>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
