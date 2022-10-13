import Head from 'next/head';
import React, { FC } from 'react';

import Footer from './footer';
import Navigation from './navigation';

type Props = {
  pageTitle?: string;
  children: React.ReactNode;
};

const Layout: FC<Props> = ({ children, pageTitle }) => (
  <div className="container mx-auto px-4 font-mono">
    <Head>
      <title>Teller.sh - {pageTitle ? pageTitle : 'An Email Service for Money Management'}</title>
    </Head>
    <Navigation />
    {children}
    <Footer />
  </div>
);

export default Layout;
