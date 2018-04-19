const path = require('path');
const rimraf = require('rimraf');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const commonConfig = require('./webpack.common');

const [webConfig, weexConfig] = commonConfig;

webConfig.plugins.push(new UglifyJSPlugin());
weexConfig.plugins.unshift(new UglifyJSPlugin());
rimraf.sync(path.resolve(__dirname, 'dist'));

module.exports = [webConfig, weexConfig];
