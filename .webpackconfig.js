const  webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  entry: {
    main:'./src/js/main.js'
  },
  output: {
    filename: 'filter.js',
    chunkFilename: '[id]-chunk.js',
    path: __dirname + '/shop/assets/'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        options: {
          presets: [
            ["env", {
              "targets": {
                "browsers": ["last 2 versions", "ie >= 11"]
              }
            }]
          ],
          plugins: [require('babel-plugin-syntax-dynamic-import')],
          cacheDirectory: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ]
      }
      
    ]
  },
  devtool: 'eval-source-map',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },
  
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new VueLoaderPlugin()
  ],
  optimization: {
    minimize: true
  }
};