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
      '@route': path.resolve(__dirname, 'src/route'),
      '@store': path.resolve(__dirname, 'src/store')
    },
    extensions: [
      '.js',
      '.vue'
    ]
  }
}
