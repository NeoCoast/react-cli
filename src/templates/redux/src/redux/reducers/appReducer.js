import fromJS from '@neocoast/neox';
import * as constants from 'Redux/actions/constants';

export const initialState = fromJS({
  loading: false,
  user: {},
});

export default function appReducer(state = initialState, { type, payload }) {
  switch (type) {
    case constants.FETCH_USER_SUCCESS:
      return state
        .set('user', { ...payload });

    case constants.SET_LOADING:
      return state
        .set('loading', payload.value);

    default:
      return state;
  }
}
