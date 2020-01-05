const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const defaultMode = 'development'

module.exports = {
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
      {
        test: /\.js$/,
        loader: 'eslint-loader'
      },
      {
        test: /\.vue$/,
        loader: [
          'vue-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@route': path.resolve(__dirname, 'src/route')
    },
    extensions: [
      '.js',
      '.vue'
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'Amidz',
      template: './src/index.ejs'
    }),
    new CopyWebpackPlugin([
      {
        from: 'symbols/*.svg',
        to: '',
        context: path.resolve(__dirname, 'src')
      }
    ])
  ]
}
