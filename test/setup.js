// NOTE: this script is outside of webpack processing.

// imports browser environment to Node for Vue Test Utils.
require('jsdom-global')()

const chai = require('chai')

global.expect = chai.expect
