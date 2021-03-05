/* eslint-disable no-underscore-dangle */

import {
  createStore,
  compose,
} from 'redux';
import rootReducer, { initialAppState } from './reducers/rootReducer';

function configureStore() {
  let enhancer;
  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__({
        serialize: {
          replacer: (key, value) => value && value.toJS ? value.toJS() : value,
        },
      })
      : (f) => f;
    enhancer = compose(devToolsExtension);
  } else {
    enhancer = compose();
  }

  return createStore(rootReducer, initialAppState, enhancer);
}

export default configureStore;
