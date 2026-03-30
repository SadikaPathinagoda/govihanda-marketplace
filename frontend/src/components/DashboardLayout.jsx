'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ title, navItems, children }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="card p-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">{title}</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
