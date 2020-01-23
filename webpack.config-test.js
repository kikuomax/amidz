const path = require('path')
const nodeExternals = require('webpack-node-externals')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const commonConfig = require('./webpack.common.js')

// makes ESLint options for test.
const mainEslintOptions = require('./.eslintrc.js')
const eslintOptions = {
  parserOptions: mainEslintOptions.parserOptions,
  env: {
    ...mainEslintOptions.env,
    node: true
  },
  plugins: [
    'mocha'
  ],
  extends: [
    ...mainEslintOptions.extends,
    'plugin:mocha/recommended'
  ],
  // disables the default .eslintrc.js file
  // because it has precedence to this config.
  useEslintrc: false
}

// reference: https://github.com/sysgears/mochapack/blob/master/docs/installation/webpack-configuration.md
module.exports = {
  // target must be 'node' for mochapack.
  target: 'node',
  mode: 'development',
  // inline source maps.
  devtool: 'inline-cheap-module-source-map',
  // entry and output.path are substituted by mochapack.
  output: {
    // configurations for source maps.
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  module: {
    rules: [
      ...commonConfig.module.rules,
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: eslintOptions
        }
      },
      {
        test: /\.vue$/,
        use: [
          'vue-loader',
          {
            loader: 'eslint-loader',
            options: eslintOptions
          }
        ]
      },
      {
        test: /\.css$/,
        use: 'null-loader'
      }
    ]
  },
  resolve: {
    alias: {
      ...commonConfig.resolve.alias,
      '@test-helper': path.resolve(__dirname, 'test/helper')
    },
    extensions: commonConfig.resolve.extensions
  },
  externals: [
    // ignores all modules in the node_modules directory.
    nodeExternals()
  ],
  plugins: [
    new VueLoaderPlugin()
  ]
}
