// NOTE: this script is outside of webpack processing.

// imports browser environment to Node for Vue Test Utils.
require('jsdom-global')()

const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

global.expect = chai.expect
