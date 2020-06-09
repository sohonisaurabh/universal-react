import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Props } from './types';
import NavBar from '../../molecules/NavBar';

const Header = ({ nav, className }: Props): ReactNode => (
  <div className={className}>
    <header id="header">
      <Link href="/">
        <a href="/" className="logo">
          Sample Logo for site
        </a>
      </Link>
      {nav && <NavBar items={nav} />}
    </header>
  </div>
);

Header.defaultProps = {};

export default Header;
