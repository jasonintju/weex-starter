const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const entry = {};
function getEntryFile(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullpath = path.join(dir, file);
    const stat = fs.statSync(fullpath);
    const extname = path.extname(fullpath);

    if (stat.isFile() && extname === '.js') {
      const name = path.basename(file, extname);
      entry[name] = fullpath;
    }
  });
}
const entryFolderPath = path.resolve(__dirname, 'src/entry');
// 遍历src/entry文件夹下的一级js文件做打包入口，即entry/*.js
getEntryFile(entryFolderPath);

const webConfig = {
  entry,
  output: {
    filename: '[name].web.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader']
      },
      {
        test: /\.vue(\?[^?]+)?$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              optimizeSSR: false,
              postcss: [
                // to convert weex exclusive styles.
                require('postcss-plugin-weex')(),
                require('autoprefixer')({
                  browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
                }),
                require('postcss-plugin-px2rem')({
                  // base on 750px standard.
                  rootValue: 75,
                  // to leave 1px alone.
                  minPixelValue: 1.01
                })
              ],
              compilerModules: [
                {
                  postTransformNode: el => {
                    // to convert vnode for weex components.
                    require('weex-vue-precompiler')()(el);
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: []
};

const weexConfig = {
  entry,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader']
      },
      {
        test: /\.vue(\?[^?]+)?$/,
        use: ['weex-loader']
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '// { "framework": "Vue" }\n"use weex:vue";\n',
      raw: true
    })
  ]
};

module.exports = [webConfig, weexConfig];
