import each from 'lodash/each';
import { END } from 'redux-saga';
import getSagaInjectors from './sagaInjectors';
import { Reducer, Store } from 'redux';

type StoreType = Store & {
  globalSaga: any;
  injectedReducers: { [key: string]: Reducer };
  injectedSagas: { [key: string]: any };
  runSaga: Function;
};

/**
 * @function monitorSagas - Wait till all sagas have been done
 * @param {Object} store
 */
export default async function monitorSagas(
  store: StoreType,
  isServer: boolean,
  shouldDispatchEnd = true
) {
  const allTasks = [store.globalSaga.task];
  if (shouldDispatchEnd) store.dispatch(END);
  each(store.injectedSagas, saga => {
    allTasks.push(saga.task);
  });
  // eslint-disable-next-line compat/compat
  return Promise.all(allTasks.map(t => t.done)).then(() => {
    if (!isServer && shouldDispatchEnd) {
      const { injectSaga } = getSagaInjectors(store);
      each(store.injectedSagas, (descriptor, key) => {
        const { saga } = descriptor;
        injectSaga(key, { saga });
      });
      store.runSaga(store.globalSaga.globalSaga);
    }
  });
}
