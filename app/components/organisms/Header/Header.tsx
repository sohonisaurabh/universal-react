import React from 'react';
import Link from 'next/link';
import { Props } from './types';
import NavBar from '../../molecules/NavBar';

const Header: React.FC<Props> = ({ nav, className }: Props) => (
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
