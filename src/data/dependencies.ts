export default {
  axios: {
    deps: ['axios', 'axios-case-converter'],
  },
  base: {
    deps: ['dotenv', 'react', 'react-dom'],
    devDeps: [
      '@babel/core',
      '@babel/plugin-transform-runtime',
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/runtime',
      '@svgr/webpack',
      'babel-loader',
      'css-loader',
      'dotenv',
      'html-loader',
      'html-webpack-plugin',
      'style-loader',
      'url-loader',
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
      'webpack-merge',
    ],
  },
  eslint: {
    devDeps: [
      'babel-eslint',
      'eslint',
      'eslint-config-airbnb',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
    ],
  },
  preCommit: {
    devDeps: ['husky'],
  },
  redux: {
    deps: ['redux', 'react-redux', '@neocoast/neox'],
  },
  reduxSagas: {
    deps: ['redux-saga'],
    devDeps: ['eslint-plugin-redux-saga'],
  },
  router: {
    deps: ['react-router-dom'],
  },
  sass: {
    devDeps: ['node-sass', 'sass-loader'],
  },
  stylelint: {
    devDeps: ['stylelint', 'stylelint-config-standard', 'stylelint-order'],
  },
};
