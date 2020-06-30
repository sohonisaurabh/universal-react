import conformsTo from 'lodash/conformsTo';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import invariant from 'invariant';
import { Reducer } from 'redux';

export type CustomStore = {
  dispatch: Function;
  subscribe: Function;
  getState: Function;
  replaceReducer: Function;
  runSaga: Function;
  injectedReducers: { [key: string]: Reducer };
  injectedSagas: { [key: string]: any };
};

/**
 * Validate the shape of redux store
 *  @param {Object} store The store to verify
 */
export default function checkStore(store: CustomStore) {
  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    runSaga: isFunction,
    injectedReducers: isObject,
    injectedSagas: isObject,
  };
  invariant(conformsTo(store, shape), 'checkStore: Expected a valid redux store');
}
