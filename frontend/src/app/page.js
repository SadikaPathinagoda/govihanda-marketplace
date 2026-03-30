import Link from 'next/link';
import { Leaf, ShoppingBag, Truck, TrendingUp, ArrowRight, Shield, Users } from 'lucide-react';

const features = [
  { icon: ShoppingBag, title: 'Direct Sales', desc: 'Farmers list products directly — no middlemen cutting into your margins.' },
  { icon: TrendingUp, title: 'Bidding System', desc: 'Buyers compete with fair bids, giving farmers the best possible price.' },
  { icon: Truck, title: 'Transport & Storage', desc: 'Find verified transport and cold storage providers near you.' },
  { icon: Shield, title: 'Verified Providers', desc: 'Service providers are admin-approved before appearing in the directory.' },
  { icon: TrendingUp, title: 'Market Prices', desc: 'Daily crop price data by district to help you make informed decisions.' },
  { icon: Users, title: 'Trusted Reviews', desc: 'Post-transaction ratings keep everyone accountable.' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur rounded-full p-4">
              <Leaf className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            GoviHanda
          </h1>
          <p className="text-xl text-primary-100 mb-3">Direct Marketplace for Sri Lankan Farmers</p>
          <p className="text-primary-200 max-w-2xl mx-auto mb-10">
            Connect directly with buyers, get fair prices for your harvest, and access transport and cold storage services — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/marketplace" className="bg-white text-primary-700 font-semibold py-3 px-8 rounded-xl hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
              Browse Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/register" className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-xl border border-primary-400 hover:bg-primary-500 transition-colors">
              Join as Farmer
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '500+', label: 'Farmers' },
            { value: '1,200+', label: 'Products Listed' },
            { value: '25', label: 'Districts Covered' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary-700">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Everything you need</h2>
          <p className="text-center text-gray-500 mb-12">A complete platform for the Sri Lankan agricultural supply chain</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-primary-200 mb-8 max-w-lg mx-auto">Join hundreds of farmers and buyers already trading on GoviHanda.</p>
        <Link href="/register" className="bg-white text-primary-700 font-semibold py-3 px-8 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center gap-2">
          Create Free Account <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
