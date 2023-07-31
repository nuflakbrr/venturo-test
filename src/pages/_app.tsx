import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { MenuProvider } from '@/context/MenuContext';
import Navbar from '@/components/Mixins/Navbar/Navbar';
import { CartProvider } from '@/context/CartContext';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <MenuProvider>
        <Navbar />

        <ToastContainer autoClose={1500} />

        <Component {...pageProps} />
      </MenuProvider>
    </CartProvider>
  );
}

export default MyApp;
