import { ReactNode } from 'react';

export type NavItem = { label: string; href: string };

export type Props = {
  className: string;
  children?: ReactNode;
  items?: Array<NavItem>;
};
