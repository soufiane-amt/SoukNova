'use client';
import '../globals.css';
import { Poppins } from 'next/font/google';
import { Inter } from 'next/font/google';
import { CartProvider } from '../context/CartContext';
import { usePathname } from 'next/navigation';
import NavBar from '../components/layout/NavBar/Navbar';
import { useEffect } from 'react';

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
  const pathname = usePathname();
  const navBarExists = pathname.includes('/auth');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased">
        <CartProvider>
          {!navBarExists && <NavBar />}
          <div className={navBarExists ? '' : 'md:mt-15 sm:mt-0'}>
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
