// @flow
import React from 'react';
import type { Node } from 'react';
import type { Props } from './types';

import HomePageComponent from '../../../components/templates/HomePage';

const HomePage = (props: Props): Node => <HomePageComponent {...props} />;

export default HomePage;
