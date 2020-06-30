import { put, takeEvery, call } from 'redux-saga/effects';
import { loadErrorPageSuccess, loadErrorPageFailure } from './ErrorPage.actions';
import { LOAD_ERROR_PAGE } from './ErrorPage.constants';
import API from '../../../utils/fetch';
import { Action } from 'redux';

interface ErrorPageAction extends Action {
  type: typeof LOAD_ERROR_PAGE;
  payload?: any;
}

export function* loadErrorPageDataSaga(action: ErrorPageAction) {
  try {
    const data = yield call(API.fetch, '/b/5b613ce62b23fb1f2b6adf8a', action);
    yield put(loadErrorPageSuccess(data));
  } catch (err) {
    yield put(loadErrorPageFailure());
  }
}

export default function* errorPageSaga() {
  try {
    yield takeEvery(LOAD_ERROR_PAGE, loadErrorPageDataSaga);
  } catch (err) {
    yield put(loadErrorPageFailure());
  }
}
