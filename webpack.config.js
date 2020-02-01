const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

const commonConfig = require('./webpack.common.js')

const defaultMode = 'development'

module.exports = {
  name: 'main',
  mode: defaultMode,
  entry: './src/index.js',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      ...commonConfig.module.rules,
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader'
      },
      {
        test: /\.vue$/,
        use: [
          'vue-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: commonConfig.resolve,
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'Amidz',
      template: './src/index.ejs'
    }),
    new CopyWebpackPlugin([
      {
        from: 'manifest.json',
        to: '',
        context: path.resolve(__dirname, 'src')
      },
      {
        from: 'symbols/*.svg',
        to: '',
        context: path.resolve(__dirname, 'src')
      },
      {
        from: 'assets/**/*',
        to: '',
        context: path.resolve(__dirname, 'src')
      }
    ]),
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/service-worker.js',
      importWorkboxFrom: 'local',
      exclude: [
        // excludes desktop icons.
        /icon-.*\.png$/
      ]
    })
  ]
}
