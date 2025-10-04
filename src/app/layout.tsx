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
