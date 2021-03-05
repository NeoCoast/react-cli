import {
  take,
  // call,
  put,
} from 'redux-saga/effects';
import * as constants from 'Redux/actions/constants';

function* fetchUser() {
  while (true) {
    yield take(constants.FETCH_USER);

    try {
      const response = {}; // yield call(/* API CALL FUNCTION */);
      yield put({ payload: { ...response }, type: constants.FETCH_USER_SUCCESS });
    } catch (error) {
      yield put({ type: constants.FETCH_USER_ERROR });
    }
  }
}

export default [
  fetchUser,
];
