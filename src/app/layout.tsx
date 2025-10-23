'use client';
import '../globals.css';
import { Poppins } from 'next/font/google';
import { Inter } from 'next/font/google';
import { CartProvider } from '../context/CartContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar/Navbar';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});


function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
      {message}
      <button onClick={onClose} className="ml-3 text-sm underline">
        Close
      </button>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navBarExists, setNavbar] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setNavbar(pathname.includes('/auth'));
  }, [pathname]);
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased">
        <CartProvider>
          {navBarExists ? null : <NavBar />}
          <div className={navBarExists ? '' : 'md:mt-15 sm:mt-0'}>
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
