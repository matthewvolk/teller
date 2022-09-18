import '../styles/globals.css';
import type { AppProps } from 'next/app';

function Teller({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default Teller;
