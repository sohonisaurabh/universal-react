// @flow
import React from 'react';
import type { Node } from 'react';
import type { Props } from './types';

import HeaderComponent from '../../../components/organisms/Header';

const Header = (props: Props): Node => <HeaderComponent {...props} />;

export default Header;
