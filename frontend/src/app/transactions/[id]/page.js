'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { transactionAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ArrowLeft, Package, User, MapPin, Phone, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];
const DELIVERY_STATUSES = ['pending', 'arranged', 'in_transit', 'delivered', 'failed'];
const TX_STATUSES = ['active', 'completed', 'cancelled', 'disputed'];

const statusBadge = {
  active: 'badge-blue', completed: 'badge-green',
  cancelled: 'badge-red', disputed: 'badge-yellow',
  pending: 'badge-yellow', paid: 'badge-green',
  delivered: 'badge-green', arranged: 'badge-blue',
  in_transit: 'badge-blue', failed: 'badge-red',
};

function StatusSelect({ label, value, options, onChange, disabled }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <select
        className="input-field text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o.replace('_', ' ')}</option>
        ))}
      </select>
    </div>
  );
}

function TransactionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    transactionAPI.getTransactionById(id)
      .then((res) => {
        setTx(res.data);
        setUpdates({
          paymentStatus: res.data.paymentStatus,
          deliveryStatus: res.data.deliveryStatus,
          storageStatus: res.data.storageStatus,
          transactionStatus: res.data.transactionStatus,
        });
      })
      .catch(() => {
        toast.error('Failed to load transaction');
        router.back();
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await transactionAPI.updateStatus(id, updates);
      setTx(res.data);
      toast.success('Transaction updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (val) => setUpdates((prev) => ({ ...prev, [field]: val }));

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {['t1', 't2', 't3'].map((k) => <div key={k} className="card animate-pulse h-24" />)}
      </div>
    );
  }

  if (!tx) return null;

  // tx.farmer is a populated object; compare as strings to avoid ObjectId reference mismatch
  const farmerId = tx.farmer?._id?.toString() ?? tx.farmer?.toString();
  const isFarmer = farmerId === user?._id?.toString();
  const isAdmin = user?.role === 'admin';
  const canEdit = isFarmer || isAdmin;

  const backHref = isFarmer ? '/farmer/transactions' : '/buyer/purchases';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Transaction Detail</h1>
          <p className="text-xs text-gray-400 mt-1">ID: {tx._id}</p>
        </div>
        <span className={`badge ${statusBadge[tx.transactionStatus]}`}>{tx.transactionStatus}</span>
      </div>

      {/* Product */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-1">
          <Package className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-gray-900">Product</h2>
        </div>
        <p className="text-gray-700 font-medium">{tx.product?.title}</p>
        <p className="text-sm text-gray-500">{tx.product?.category} · {tx.product?.district}</p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Unit Price</p>
            <p className="font-bold text-gray-900">{formatCurrency(tx.agreedPrice)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Quantity</p>
            <p className="font-bold text-gray-900">{tx.quantity} {tx.product?.unit}</p>
          </div>
          <div className="bg-primary-50 rounded-lg p-3 text-center">
            <p className="text-xs text-primary-600 mb-1">Total</p>
            <p className="font-bold text-primary-700">{formatCurrency(tx.totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {[
          { label: 'Farmer', person: tx.farmer, icon: User },
          { label: 'Buyer', person: tx.buyer, icon: User },
        ].map(({ label, person, icon: Icon }) => (
          <div key={label} className="card">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
            </div>
            <p className="font-semibold text-gray-900">{person?.name}</p>
            {person?.district && (
              <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3" /> {person.district}
              </p>
            )}
            {person?.phone && (
              <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <Phone className="w-3 h-3" /> {person.phone}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Status panel */}
      <div className="card mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Status Tracking</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <StatusSelect
            label="Payment Status"
            value={updates.paymentStatus}
            options={PAYMENT_STATUSES}
            onChange={set('paymentStatus')}
            disabled={!canEdit}
          />
          <StatusSelect
            label="Delivery Status"
            value={updates.deliveryStatus}
            options={DELIVERY_STATUSES}
            onChange={set('deliveryStatus')}
            disabled={!canEdit}
          />
          <StatusSelect
            label="Transaction Status"
            value={updates.transactionStatus}
            options={TX_STATUSES}
            onChange={set('transactionStatus')}
            disabled={!canEdit}
          />
        </div>

        {canEdit && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary mt-5 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="card text-sm text-gray-500">
        <p>Created: {formatDate(tx.createdAt)}</p>
        {tx.notes && <p className="mt-2 italic">{tx.notes}</p>}
      </div>
    </div>
  );
}

export default function TransactionDetailPage() {
  return (
    <ProtectedRoute allowedRoles={['farmer', 'buyer', 'admin']}>
      <TransactionDetail />
    </ProtectedRoute>
  );
}
