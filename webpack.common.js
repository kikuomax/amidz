const path = require('path')

module.exports = {
  module: {
    rules: [
      // loads an SVG file as a Vue component.
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          {
            loader: 'vue-svg-loader',
            options: {
              svgo: {
                plugins: [
                  {
                    removeDimensions: true
                  },
                  {
                    removeViewBox: false
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@db': path.resolve(__dirname, 'src/db'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@route': path.resolve(__dirname, 'src/route'),
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@store': path.resolve(__dirname, 'src/store')
    },
    extensions: [
      '.css',
      '.scss',
      '.js',
      '.vue'
    ]
  }
}
