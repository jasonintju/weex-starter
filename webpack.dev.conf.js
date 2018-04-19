const webpack = require('webpack');
const ip = require('ip').address();
const portfinder = require('portfinder');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common');

// 生成weex.js
const weexConfig = webpackMerge(commonConfig[1], {
  watch: true
});
webpack(weexConfig, (err, stats) => {
  if (err) {
    console.err('COMPILE ERROR:', err.stack);
  }
});

const webConfig = webpackMerge(commonConfig[0], {
  devServer: {
    contentBase: __dirname,
    host: ip,
    historyApiFallback: true,
    inline: true,
    open: true
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  }
});

portfinder.getPort((err, port) => {
  if (err) {
    console.log(err);
  } else {
    webConfig.devServer.port = port;
  }
});

module.exports = webConfig;
