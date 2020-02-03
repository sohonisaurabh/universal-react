// @flow
import { setTrackerConfig } from '../../utils/analytics';

import { CURRENT_ROUTE } from '../constants';
import trackingConfig from './trackerConfig';
import setDataLayer from './setDataLayer';

const initializeTrackerConfig = () =>
  setTrackerConfig({
    initialConfigs: trackingConfig(),
    actions: [CURRENT_ROUTE],
    callback: setDataLayer,
  });

export default initializeTrackerConfig;
