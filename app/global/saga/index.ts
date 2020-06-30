import { all, takeLatest, call, put } from 'redux-saga/effects';
import API_URLS from '../../constants/api/services';
import API from '../../utils/fetch';
import { GET_APPLICATION_LABELS } from '../constants';
import { serverActions } from '../actions';
import { Action } from 'redux';

interface GlobalAction extends Action {
  type: typeof GET_APPLICATION_LABELS;
  payload?: any;
}

export function* getApplicationLabels(actions: GlobalAction) {
  try {
    const data = yield call(API.fetch, API_URLS.labels, actions);
    yield put(serverActions.setApplicationLabels(data));
  } catch (err) {
    yield put(serverActions.setApplicationLabels({}));
  }
}

export default function* globalSaga() {
  yield all([takeLatest(GET_APPLICATION_LABELS, getApplicationLabels)]);
}
