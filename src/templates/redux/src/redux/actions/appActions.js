/* eslint-disable sort-keys */

import * as constants from './constants';

export const fetchUser = () => (
  { type: constants.FETCH_USER }
);

export const setLoading = (value) => (
  {
    type: constants.SET_LOADING,
    payload: value,
  }
);
