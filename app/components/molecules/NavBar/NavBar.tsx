/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactNode } from 'react';
// No types found for Anchor, hence ignoring TS type checking
//@ts-ignore
import { AnchorVanilla as Anchor } from '@xt-pagesource/atomic-react-pattern-lib';
import Link from 'next/link';
import styles from './NavBar.style';
import withStyles from '../../../lib/withStyles';
import { Props } from './types';
import { isApplicationLink } from '../../../utils/isApplicationLink';

const NavBar = ({ className, items, children }: Props): ReactNode => (
  <nav className={className}>
    {children || (
      <ul>
        {Array.isArray(items) &&
          items.map(({ label, href }, key) => (
            <li role="none" key={key.toString()}>
              {isApplicationLink(href) ? (
                <Link href={href}>
                  <a role="menuitem">{label}</a>
                </Link>
              ) : (
                <Anchor to={href} role="menuitem">
                  {label}
                </Anchor>
              )}
            </li>
          ))}
      </ul>
    )}
  </nav>
);

NavBar.defaultProps = {
  items: [],
};

export default withStyles(NavBar, styles);

export { NavBar };
