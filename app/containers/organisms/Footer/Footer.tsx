import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Props, State } from './types';

import FooterComponent from '../../../components/organisms/Footer';
import { Props as FooterComponentProps } from '../../../components/organisms/Footer/types';

const Footer: React.FC<Props & FooterComponentProps> = props => <FooterComponent {...props} />;

const mapStateToProps = (state: State) => ({
  nav: get(state, ['global', 'globalData', 'labels', 'header', 'nav']),
});

export default connect(mapStateToProps)(Footer);
