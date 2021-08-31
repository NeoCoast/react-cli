const path = require('path');

module.exports = () => ({
  devServer: {
    compress: true,
    historyApiFallback: true,
  },
});
