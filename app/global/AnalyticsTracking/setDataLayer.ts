import { CallbackData } from './types';

interface nextJSProcess extends NodeJS.Process {
  browser: boolean;
}

interface analyticsWindow extends Window {
  dataLayer: Object;
}

/**
 * Set Tracking Data to window data layer
 * @param {CallbackData} trackingOptions
 */
const setDataLayer = ({ initialConfigs, data, type }: CallbackData) => {
  if ((process as nextJSProcess).browser) {
    ((window as unknown) as analyticsWindow).dataLayer = { ...initialConfigs, ...data, type };
  }
};

export default setDataLayer;
