import get from 'lodash/get';
import set from 'lodash/set';

import {
  DEVICE_TYPE,
  REGION_TYPE,
  CONFIG_KEYS,
  CURRENT_ROUTE,
  IS_TABLET,
  PAGE_URL,
  PAGE_QUERY,
  CHECK_AUTH_SUCCESS,
  SET_USER_STATE,
  USER_STATE_LOGGED_IN,
  UPDATE_SESSION_EMAIL,
  PAGE_ORIGIN,
  GET_APPLICATION_LABELS_SUCCESS,
} from '../constants';
import { GlobalActions } from '../types';
import { setCookie } from '../../utils/utils';

import { GlobalState } from '../types';

export const initState = {
  deviceType: '',
  activeRegion: '',
};

const setDevice = (state: GlobalState, deviceType: GlobalState['deviceType']): GlobalState =>
  set(state, 'deviceType', deviceType);

const setIsTablet = (state: GlobalState, isTablet: GlobalState['isTablet']): GlobalState =>
  set(state, 'isTablet', isTablet);

const setConfigKeys = (state: GlobalState, configKeys: GlobalState['configKeys']): GlobalState =>
  set(state, 'configKeys', configKeys);

const setRegion = (state: GlobalState, activeRegion: GlobalState['activeRegion']): GlobalState =>
  set(state, 'activeRegion', activeRegion);

const setPageUrl = (state: GlobalState, pageUrl: GlobalState['pageUrl']): GlobalState =>
  set(state, 'pageUrl', pageUrl);

const setRoute = (state: GlobalState, pathname: GlobalState['pathName']): GlobalState =>
  set(state, 'route', pathname);

const setPageQuery = (state: GlobalState, pageQuery: GlobalState['pageQuery']) =>
  set(state, 'pageQuery', pageQuery);

const setAuthentication = (state: GlobalState, sessionInfo: GlobalState['sessionInfo']) =>
  set(state, 'sessionInfo', sessionInfo);

const setSessionEmail = (state: GlobalState) => {
  const sessionInfo = get(state, 'sessionInfo');
  return set(state, 'sessionInfo', sessionInfo);
};

const setUserState = (state: GlobalState, userState: GlobalState['userState']) => {
  if (userState === USER_STATE_LOGGED_IN) setCookie('lastLogin', new Date());
  return set(state, 'userState', userState);
};

const setPageOrigin = (state: GlobalState, origin: GlobalState['origin']) =>
  set(state, 'pageOrigin', origin);

const setApplicationLabels = (state: GlobalState, labels: GlobalState['labels']) =>
  set(state, 'labels', labels);

export default (state: GlobalState = initState, action: GlobalActions) => {
  switch (action.type) {
    case DEVICE_TYPE:
      return setDevice(state, get(action, 'deviceType'));
    case IS_TABLET:
      return setIsTablet(state, get(action, 'isTablet'));
    case REGION_TYPE:
      return setRegion(state, get(action, 'activeRegion'));
    case CONFIG_KEYS:
      return setConfigKeys(state, get(action, 'configKeys'));
    case CURRENT_ROUTE:
      return setRoute(state, get(action, 'pathname'));
    case PAGE_URL:
      return setPageUrl(state, get(action, 'pageUrl'));
    case PAGE_QUERY:
      return setPageQuery(state, get(action, 'pageQuery'));
    case CHECK_AUTH_SUCCESS:
      return setAuthentication(state, get(action, 'sessionInfo'));
    case UPDATE_SESSION_EMAIL:
      return setSessionEmail(state);
    case SET_USER_STATE:
      return setUserState(state, get(action, 'userState'));
    case PAGE_ORIGIN:
      return setPageOrigin(state, get(action, 'origin'));
    case GET_APPLICATION_LABELS_SUCCESS:
      return setApplicationLabels(state, get(action, 'data'));
    default:
      return state;
  }
};
