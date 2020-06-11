import { createStore, applyMiddleware, compose, Reducer, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
//@ts-ignore - No types for v1 of next-redux-wrapper found
import nextReduxWrapper from 'next-redux-wrapper';

import createReducer from './reducers';
import globalSaga from '../../global/saga';

import { trackingMiddleware } from '../../utils/analytics/trackingMiddleware';
import { getTracker } from '../../utils/analytics/helpers/initTracker';
import { Component } from 'react';

const tracker = getTracker();

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware, trackingMiddleware(tracker)];
const enhancers = [applyMiddleware(...middlewares)];

// Choose compose method depending upon environment and platform
const composeEnhancers =
  process.env.NODE_ENV !== 'production' && typeof window === 'object'
    ? composeWithDevTools
    : compose;

type optionsType = {
  key: string;
  reducer?: Reducer;
  saga?: any;
};

type storeType = Store & {
  globalSaga: any;
  injectedReducers: { [key: string]: Reducer | undefined };
  injectedSagas: { [key: string]: any };
  runSaga: Function;
};

export default (options: optionsType) => (BaseComponent: Component & { displayName: string }) => {
  const hasKey = !!options.key;
  if (!hasKey) throw new Error(`${BaseComponent.displayName} needs to be passed with a key`);
  const hasReducer = !!options.reducer;
  const hasSaga = !!options.saga;
  const reducer = hasKey && hasReducer ? { [options.key]: options.reducer } : {};

  const configureStore = (initialState = {}) => {
    const store: storeType = createStore(
      createReducer(reducer),
      initialState,
      //@ts-ignore - composeWithDevTools accepts only one argument while compose accepts multiple
      composeEnhancers(...enhancers)
    );

    // Keep access to 'run' method of saga task in store so thats its available globally with store
    store.runSaga = sagaMiddleware.run;
    // Keep record of reducer injected in store associated with unique key
    store.injectedReducers = reducer;
    if (globalSaga) {
      // Run global saga and keep the task returned by running saga to access later while cancelling
      store.globalSaga = { globalSaga, task: store.runSaga(globalSaga) };
    }
    // Keep record of saga injected in store associated with unique key
    store.injectedSagas = {};
    if (hasSaga) {
      // Run saga and keep the task returned by running saga to access later while cancelling
      store.injectedSagas[options.key] = { ...options.saga, task: store.runSaga(options.saga) };
    }
    return store;
  };

  return nextReduxWrapper(configureStore)(BaseComponent);
};
