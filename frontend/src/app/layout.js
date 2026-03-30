import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GoviHanda – Direct Marketplace for Sri Lankan Farmers',
  description: 'Connect farmers, buyers and service providers in one transparent agricultural marketplace.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
