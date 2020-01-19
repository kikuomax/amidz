'use strict'

module.exports = {
  plugins: [
    'plugins/markdown',
    'node_modules/jsdoc-vuejs'
  ],
  source: {
    include: ['./src'],
    includePattern: '.+\\.(js|vue)$'
  },
  opts: {
    encoding: 'utf8'
  }
}
