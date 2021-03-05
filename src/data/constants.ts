export const availableConfigs = [
  { value: 'axios', name: 'axios' },
  { value: 'eslint', name: 'eslint' },
  { value: 'reactRouter', name: 'react-router' },
  { value: 'redux', name: 'redux' },
  { value: 'reduxSaga', name: 'redux-saga' },
  { value: 'sass', name: 'sass' },
  { value: 'stylelint', name: 'stylelint' },
];

export const routerTypes = [
  {
    value: 'browser',
    name: 'Browser router',
    moduleName: 'BrowserRouter',
  }, {
    value: 'hash',
    name: 'Hash router',
    moduleName: 'HashRouter',
  },
];
