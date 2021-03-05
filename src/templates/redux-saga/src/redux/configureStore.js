/* eslint-disable no-underscore-dangle */

import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { initialAppState } from 'Redux/reducers/rootReducer';
import sagas from 'Redux/sagas';

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];

  let enhancer;
  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__({
        serialize: {
          replacer: (key, value) => value && value.toJS ? value.toJS() : value,
        },
      })
      : (f) => f;

    enhancer = compose(
      applyMiddleware(...middleware),
      devToolsExtension,
    );
  } else {
    enhancer = compose(
      applyMiddleware(...middleware),
    );
  }

  const store = createStore(rootReducer, initialAppState, enhancer);
  sagas.map((saga) => sagaMiddleware.run(saga));

  return store;
}

export default configureStore;
