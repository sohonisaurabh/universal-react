import invariant from 'invariant';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import checkStore, { CustomStore } from './checkStore';
import createReducer from './reducers';
import { Reducer } from 'redux';

/**
 * @function injectReducerFactory
 * @param {Object} store
 * @param {boolean} isValid - Prechecked if store is valid
 */
export function injectReducerFactory(store: CustomStore, isValid: boolean) {
  /**
   * @function injectReducer
   * @param {string} key - Unique key saga
   * @param {Object} reducer
   */
  function injectReducer(key: string, reducer: Reducer) {
    if (!isValid) checkStore(store);

    invariant(
      isString(key) && !isEmpty(key) && isFunction(reducer),
      'reducerInjector.js: Expected `reducer` to be a reducer function'
    );

    // Check `store.injectedReducers[key] === reducer` for hot
    // reloading when a key is the same but a reducer is different
    if (
      Object.prototype.hasOwnProperty.call(store.injectedReducers, key) &&
      store.injectedReducers[key] === reducer
    ) {
      return;
    }

    store.injectedReducers[key] = reducer; // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.injectedReducers));
  }
  return injectReducer;
}

/**
 * @typedef {Object} ReducerInjectors
 * @property {function} injectReducer
 * @property {function} ejectSaga
 */

/**
 * @function getInjectors
 * @param {Object} store
 * @returns {ReducerInjectors}
 */
export default function getInjectors(store: CustomStore) {
  checkStore(store);

  return {
    injectReducer: injectReducerFactory(store, true),
  };
}
