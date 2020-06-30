import invariant from 'invariant';
import isString from 'lodash/isString';
import each from 'lodash/each';
import getSagaInjectors from './sagaInjectors';
import getReducerInjectors from './reducerInjectors';
import { Reducer } from 'redux';
import { CustomStore } from './checkStore';

export default (key: string, store: CustomStore, saga: Function, reducer: Reducer) => {
  invariant(
    isString(key),
    `injectSagaAndReducer.js: Expected "key" to be a string, found it to be ${typeof key}`
  );

  const { injectReducer } = getReducerInjectors(store);
  const { injectSaga, ejectSaga } = getSagaInjectors(store);

  each(store.injectedSagas, (_sagas, sagaName) => {
    ejectSaga(sagaName);
    // eslint-disable-next-line no-param-reassign
    delete store.injectedSagas[sagaName];
  });

  if (reducer) injectReducer(key, reducer);
  if (saga) injectSaga(key, { saga });
};
