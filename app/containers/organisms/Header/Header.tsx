import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Props, State } from './types';

import HeaderComponent from '../../../components/organisms/Header';
import { Props as HeaderComponentProps } from '../../../components/organisms/Header/types';

const Header: React.FC<Props & HeaderComponentProps> = props => {
  //@ts-ignore
  const { nav, ...other } = props;

  return <HeaderComponent nav={nav} />;
};

const mapStateToProps = (state: State) => ({
  nav: get(state, ['global', 'globalData', 'labels', 'header', 'nav']),
});

export default connect(mapStateToProps)(Header);
