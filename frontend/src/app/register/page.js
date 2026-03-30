'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { Leaf } from 'lucide-react';
import { DISTRICTS } from '@/lib/utils';

const dashboardPath = {
  farmer: '/farmer/dashboard',
  buyer: '/buyer/dashboard',
  provider: '/provider/dashboard',
};

const roles = [
  { value: 'farmer', label: 'Farmer', desc: 'I sell agricultural products' },
  { value: 'buyer', label: 'Buyer', desc: 'I buy agricultural products' },
  { value: 'provider', label: 'Service Provider', desc: 'I offer transport or storage' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'buyer', district: '' });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created successfully!');
      router.push(dashboardPath[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-700 rounded-xl mb-4">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Join GoviHanda today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a…</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3 rounded-xl border-2 text-left transition-colors ${
                      form.role === r.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <p className="font-semibold text-sm">{r.label}</p>
                    <p className="text-xs mt-0.5 opacity-70">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" className="input-field" placeholder="Sunil Perera" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" className="input-field" placeholder="07X XXX XXXX" value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" className="input-field" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select className="input-field" value={form.district} onChange={set('district')}>
                <option value="">Select district</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
