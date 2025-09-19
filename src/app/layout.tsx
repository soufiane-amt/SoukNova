import '../globals.css';
import { Poppins } from 'next/font/google';
import ConditionalNavBar from '../components/layout/NavBar/ConditionalNavBar';
import { Inter } from 'next/font/google';
import { CartProvider } from '../context/CartContext';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Example weights
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <ConditionalNavBar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
