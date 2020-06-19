/**
 * Enhance is a one of the crucial utility methods that this framework provides.
 * All page level component need to be wrapped within this method.
 *
 * - "enhance" function is used here which creates a High Order Component over the provided
 * page level component and connects itself to a Redux store.
 * - It internally has the definition of the "getInitialProps" function which will synchronously
 * be called by Next.js which has access to store and request objects from server.
 * - The High Order Component which injects the global reducer and saga (if any) that are
 * associated with that page level component in its "getInitialProps" lifecycle hook.
 * - It also then waits for the page level sagas to yield. We have a "monitorSagas"
 * function which will wait till the done property of all running sagas are resolved/rejected.
 * - "enhance" function basically creates a High Order Component and connects it to the redux store
 * taking in "mapStateToProps" and "mapDispatchToProps".
 *
 * Details: [docs/PageLevelComponents_Enhance.md]
 */
import React, { Component } from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { compose, Reducer, Store } from 'redux';
import hoistNonReactStatic from 'hoist-non-react-statics';
import Router from 'next/router';
import get from 'lodash/get';

import initRedux from './configureStore';
import monitorSagas from './monitorSagas';
import loggerFactory from '../../utils/logger';
import { DESKTOP, MOBILE, PHONE, API_ERROR_HANDLER_PAGE, TABLET } from '../../constants';
import globalActions, { serverActions, pageActions } from '../../global/actions';

import { globalDataStructure } from '../../global/reducer';
import injectSagaAndReducer from './injectSagaAndReducer';
import { parseQueryParams } from '../../utils/utils';
import { Request, Response } from 'express';
import { NextPage } from 'next';

type RequestDetailsType = {
  deviceType: 'mobile' | 'desktop';
  cookies?: Request['cookies'];
  logger?: typeof logger;
  whitelistedHeaders?: ReturnType<typeof cleanupRequestHeaders>;
};

const logger = loggerFactory.getLogger();

// List of headers to be extracted before forwarding to the respective
// endpoints from the application
const headerExclusionList = [
  'host',
  'accept',
  'content-length',
  'content-type',
  'connection',
  'cookie',
];

const cleanupRequestHeaders = (requestHeaders?: Request['headers']) => {
  if (!requestHeaders) {
    return null;
  }
  const requestHeadersCopy = { ...requestHeaders };
  headerExclusionList.forEach(header => {
    delete requestHeadersCopy[header];
  });

  // Alternative header for user agent
  requestHeadersCopy['x-ua-browser'] = requestHeaders['user-agent'];
  return requestHeadersCopy;
};

export const getWrapperComponent = (
  WrappedComponent: NextPage,
  {
    key,
    reducer,
    saga,
    initialActions,
    useQuery,
    criticalState,
    preExecuteGetInitialProps,
  }: {
    key: string;
    reducer: Reducer;
    saga: Function;
    initialActions: Array<Function>;
    useQuery?: boolean;
    criticalState: any;
    preExecuteGetInitialProps?: boolean;
  }
) =>
  class WrapperComponent extends Component {
    static addRequestDetails(
      action: { type: string; query?: string },
      requestDetails: RequestDetailsType
    ) {
      return { ...action, requestDetails };
    }

    /**
     * Method to validate if critical data required for the page is present based on which
     * page is rendered or user redirected to an error page
     *
     * @param {Object} storeStruct Structure of the critical data required for page
     * @param {Object} res Response object from incoming request for necessary redirects etc.
     * @param {Object} store Redux store of the application
     * @param {boolean} isServer Flag to indicate server/client
     */
    static validatePageData(
      storeStruct: Array<Object>,
      res: Response,
      store: Store,
      isServer: boolean
    ) {
      if (storeStruct && storeStruct.length > 0) {
        const currentState = store.getState();
        const missingDataList: Array<Object> = [];

        [...storeStruct, ...globalDataStructure].forEach(requiredDataPath => {
          try {
            if (!get(currentState, 'requiredDataPath')) {
              missingDataList.push(requiredDataPath);
            }
          } catch (e) {
            missingDataList.push(requiredDataPath);
          }
        });

        if (missingDataList.length > 0) {
          logger.error(
            //@ts-ignore - Did not find a solution to extending styled component types here
            `${WrapperComponent.displayName} - Component failed to recieve critical data`,
            JSON.stringify(missingDataList)
          );
          if (isServer) {
            res.redirect(API_ERROR_HANDLER_PAGE);
          } else {
            Router.push(API_ERROR_HANDLER_PAGE);
          }
        }
      }
    }

    /**
     * Method to dispatch all page level actions provided to the "enhance" method
     *
     * @param {Array} param.actions Array of action objects at page level
     * @param {Object} param.store Redux store object
     * @param {boolean} param.needQuery Flag to indicate if the actions need the query params
     * @param {Object} param.query Query params of the incoming request
     * @param {Object} param.requestDetails Object containing details of incoming request
     */
    static dispatchActions({
      actions,
      store,
      needQuery,
      query,
      requestDetails,
    }: {
      actions: Array<Function>;
      store: Store;
      needQuery?: boolean;
      query: string;
      requestDetails: RequestDetailsType;
    }) {
      actions.map(action =>
        store.dispatch(
          typeof action === 'function'
            ? WrapperComponent.addRequestDetails(
                action(needQuery ? query : undefined),
                requestDetails
              )
            : WrapperComponent.addRequestDetails(
                { type: action, query: needQuery ? query : undefined },
                requestDetails
              )
        )
      );
    }
    // Add the right types instead of any here
    static async getInitialProps(...params: any) {
      const initialParams = params[0];

      const { store, isServer, req = {}, query, res = {}, pathname, asPath } = initialParams;

      injectSagaAndReducer(key, store, saga, reducer);
      store.dispatch(serverActions.setCurrentRoute(pathname));
      let requestDetails: RequestDetailsType;
      let clientParams = {};
      const { device = {} } = req;
      const { headers = {} } = req;
      const { host = '' } = headers as Request['headers'];
      const { cookies = {} } = req;
      const { perfLogger = {} } = req;

      if (isServer) {
        const deviceType = device.type === PHONE ? MOBILE : DESKTOP;
        const isTablet = device.type === TABLET;
        store.dispatch(serverActions.addIsTablet(isTablet));
        store.dispatch(serverActions.addDeviceType(deviceType));
        store.dispatch(serverActions.setPageUrl(req.url));
        store.dispatch(serverActions.setPageQuery({ ...req.query, ...query }));
        store.dispatch(serverActions.setPageOrigin(`${req.protocol}://${host}`));

        requestDetails = {
          deviceType,
          cookies: cookies.cookieList,
          logger: perfLogger,
          whitelistedHeaders: cleanupRequestHeaders(headers),
        };
      } else {
        clientParams = parseQueryParams(asPath);
        store.dispatch(serverActions.setPageQuery(clientParams));
        requestDetails = {
          deviceType: get(store.getState(), ['global', 'globalData', 'deviceType']),
        };
      }

      if (preExecuteGetInitialProps && WrappedComponent.getInitialProps) {
        await WrappedComponent.getInitialProps(params);
      }

      if (isServer && globalActions instanceof Array) {
        WrapperComponent.dispatchActions({
          actions: globalActions,
          store,
          needQuery: useQuery,
          query,
          requestDetails,
        });
      }

      const combinedPageActions =
        initialActions instanceof Array ? [...pageActions, ...initialActions] : [...pageActions];

      WrapperComponent.dispatchActions({
        actions: combinedPageActions,
        store,
        needQuery: useQuery,
        query: { ...query, ...clientParams },
        requestDetails,
      });

      // Wait till all sagas are done
      await monitorSagas(store, isServer);

      WrapperComponent.validatePageData(criticalState, res, store, isServer);

      if (!preExecuteGetInitialProps && WrappedComponent.getInitialProps) {
        await WrappedComponent.getInitialProps(params);
      }

      return {
        isServer,
      };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

/**
 * Create a high order component to initialize store with reducers and sagas
 * for the page level component
 *
 * @param {Object} WrappedComponent Page level component to be wrapped with HOC
 * @param {Object} config Configuration
 * @param {function} config.mapStateToProps Map properties from state to props
 * @param {function} [config.mapDispatchToProps] Map dispatch method for the component
 * @param {string} config.key Unique key identifying the page level component and
 * hence its saga and reducer
 * @param {Object} config.reducer Root reducer for the given page level component
 * @param {Object} config.saga Root saga for the given page level component
 * @param {Object} config.initialActions Initial action to trigger page load of page level component
 */

interface EnhanceType<State, Props, DefaultRootState, DispatchProps> {
  mapStateToProps: MapStateToProps<State, Props, DefaultRootState>;
  mapDispatchToProps?: MapDispatchToProps<DispatchProps, Props>;
  key: string;
  reducer: Reducer;
  saga: Function;
  initialActions: Array<Function>;
  useQuery?: boolean;
  criticalState?: any;
}
export default <State, Props, DefaultRootState, DispatchProps>(
  WrappedComponent: NextPage,
  {
    mapStateToProps,
    mapDispatchToProps,
    key,
    reducer,
    saga,
    initialActions,
    useQuery,
    criticalState,
  }: EnhanceType<State, Props, DefaultRootState, DispatchProps>
) => {
  const WrapperComponent = getWrapperComponent(WrappedComponent, {
    key,
    reducer,
    saga,
    initialActions,
    useQuery,
    criticalState,
  });

  // Move all non react specific static properties from WrappedComponent to WrapperComponent
  hoistNonReactStatic(WrapperComponent, WrappedComponent, {
    getInitialProps: true,
  });

  // Give a unique identifier to the new high horder component
  // @ts-ignore - Again, not able to extend styled components types
  WrapperComponent.displayName = `enhanced(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;

  const withConnect = connect(mapStateToProps, mapDispatchToProps);

  const withRedux = initRedux({
    key,
    reducer,
    saga,
  });

  return compose(withRedux, withConnect)(WrapperComponent);
};
