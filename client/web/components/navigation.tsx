import Link from 'next/link';
import React, { FC } from 'react';

const Navigation: FC = () => (
  <header className="my-8">
    <nav className="flex flex-row justify-between items-center">
      <div>
        <Link className="no-underline" href={'/'}>
          <a>
            <h1 className="text-3xl font-bold"> {'> '}Teller.sh</h1>
          </a>
        </Link>
      </div>
      <div>
        <Link href={'/login'}>
          <a className="pr-4">Log In</a>
        </Link>
        <Link href={'/signup'}>
          <a className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
            Sign Up
          </a>
        </Link>
      </div>
    </nav>
  </header>
);

export default Navigation;
