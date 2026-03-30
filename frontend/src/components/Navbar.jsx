'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Leaf, User, LogOut, ChevronDown } from 'lucide-react';

const dashboardPath = {
  farmer: '/farmer/dashboard',
  buyer: '/buyer/dashboard',
  provider: '/provider/dashboard',
  admin: '/admin/dashboard',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-primary-700 text-xl">
            <Leaf className="w-6 h-6" />
            GoviHanda
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/marketplace" className="hover:text-primary-600 transition-colors">Marketplace</Link>
            <Link href="/providers" className="hover:text-primary-600 transition-colors">Services</Link>
            <Link href="/market-info" className="hover:text-primary-600 transition-colors">Market Prices</Link>
          </div>

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      href={dashboardPath[user.role] || '/'}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm">Sign In</Link>
                <Link href="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/marketplace" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Marketplace</Link>
          <Link href="/providers" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Services</Link>
          <Link href="/market-info" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Market Prices</Link>
          {user ? (
            <>
              <Link href={dashboardPath[user.role]} className="block text-sm font-medium text-primary-600" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-red-600 font-medium">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
