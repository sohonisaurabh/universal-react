import { combineReducers, Reducer } from 'redux';
import globalReducer from '../../global/reducer';

export default function createReducer(injectedReducers: { [key: string]: Reducer | undefined }) {
  return combineReducers({
    global: globalReducer,
    ...injectedReducers,
  });
}
