import { DEVICE_TYPE, REGION_TYPE, CONFIG_KEYS, CURRENT_ROUTE } from '../constants';

export type DeviceTypeAction = {
  type: typeof DEVICE_TYPE;
  deviceType: string;
};

export type setIsTabletAction = {
  type: string;
  isTablet: boolean;
};

export type ActiveRegionAction = {
  type: typeof REGION_TYPE;
  activeRegion: string;
  deviceType: string;
  userState: string;
  sessionInfo: Object;
};

export type ConfigKeyAction = {
  type: typeof CONFIG_KEYS;
  configKeys: {};
};

export type RouteAction = {
  type: typeof CURRENT_ROUTE;
  pathname: string;
};

export type GlobalActions = DeviceTypeAction | ActiveRegionAction | RouteAction | setIsTabletAction;

export interface GlobalState {
  activeRegion: string;
  configKeys?: Object;
  deviceType: string;
  isTablet?: boolean;
  labels?: Array<string>;
  origin?: string;
  pageUrl?: string;
  pageQuery?: string;
  pathName?: string;
  sessionInfo?: Object;
  userState?: string;
}
