import { combineReducers } from 'redux';
import appReducer, { initialState as appReducerInitialState } from './appReducer';
/*
import reducer1, { initialState as reducer1InitialState } from './reducer1';
*/

export const initialAppState = {
  appReducer: appReducerInitialState,
  /*
    reducer1: reducer1InitialState,
    ...,
  */
};

const rootReducer = combineReducers({
  appReducer,
  /*
    reducer1,
    ...,
  */
});

export default rootReducer;
