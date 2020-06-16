//@ts-ignore - No types found for this package
import { Tracker } from 'react-tracker';
import { ActionType, TrackerObject } from '../types';

const trackerConfig: TrackerObject = {
  initialConfigs: {},
  actions: [],
  callback: () => {},
};

export const executeListners = () => {
  const { instance, callback, initialConfigs } = trackerConfig;
  if (!initialConfigs || !callback) {
    throw new ReferenceError(
      'Tracker Config missing. Use setTrackerConfig() to set tracker config on application bootstrap'
    );
  }
  if (instance) {
    instance.on('*', (event: ActionType) => {
      const { type, data } = event;

      callback({ initialConfigs: { ...initialConfigs }, data: { ...data }, type });
    });
  }
};

export const setTrackerConfig = ({ initialConfigs, actions, callback }: TrackerObject) => {
  trackerConfig.initialConfigs = initialConfigs;
  trackerConfig.actions = actions;
  trackerConfig.callback = callback;
  executeListners();
};

export const getTracker = (): TrackerObject => {
  if (!trackerConfig.instance) {
    trackerConfig.instance = new Tracker();
  }
  return trackerConfig;
};
