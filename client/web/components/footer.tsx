import Link from 'next/link';
import React, { FC } from 'react';

const Footer: FC = () => (
  <footer className="m-8">
    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
      © {new Date().getFullYear()}{' '}
      <Link href={'/'}>
        <a className="hover:underline">Teller.sh</a>
      </Link>
      . All Rights Reserved.
    </span>
  </footer>
);

export default Footer;
