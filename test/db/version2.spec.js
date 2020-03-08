import { upgradePatternFromVersion1 } from '@db/version2'

describe('db.version2', function () {
  describe('upgradePatternFromVersion1', function () {
    // tests that upgradePatternFromVersion1
    // can upgrade `oldPattern` to `newPattern`.
    function testUpgrade ({ oldPattern, newPattern }) {
      it(`should upgrade ${JSON.stringify(oldPattern)} to ${JSON.stringify(newPattern)}`, function () {
        const upgraded = upgradePatternFromVersion1(oldPattern)
        expect(upgraded).to.deep.equal(newPattern)
      })
    }

    testUpgrade({
      oldPattern: {
        name: '$current',
        rows: [
          {
            columns: [
              {
                symbolId: 'test-symbol'
              },
              {
                symbolId: 'test-symbol2'
              }
            ]
          },
          {
            columns: [
              {
                symbolId: 'blank-symbol'
              }
            ]
          }
        ]
      },
      newPattern: {
        name: '$current',
        rows: [
          {
            position: {
              left: 0,
              top: 50
            },
            columns: [
              {
                symbolId: 'test-symbol'
              },
              {
                symbolId: 'test-symbol2'
              }
            ]
          },
          {
            position: {
              left: 0,
              top: 0
            },
            columns: [
              {
                symbolId: 'blank-symbol'
              }
            ]
          }
        ]
      }
    })

    testUpgrade({
      oldPattern: {
        name: 'test',
        rows: []
      },
      newPattern: {
        name: 'test',
        rows: []
      }
    })

    testUpgrade({
      oldPattern: {
        name: 'パターン',
        rows: [
          {
            columns: []
          }
        ]
      },
      newPattern: {
        name: 'パターン',
        rows: [
          {
            position: {
              left: 0,
              top: 0
            },
            columns: []
          }
        ]
      }
    })

    testUpgrade({
      oldPattern: {
        name: 'no-rows'
      },
      newPattern: {
        name: 'no-rows',
        rows: []
      }
    })

    testUpgrade({
      oldPattern: {
        name: 'no-columns',
        rows: [
          {}
        ]
      },
      newPattern: {
        name: 'no-columns',
        rows: []
      }
    })

    it('should throw TypeError if `pattern` is a string "pattern"', function () {
      expect(() => upgradePatternFromVersion1('pattern')).to.throw(TypeError)
    })

    it('should throw TypeError if `pattern` is `null`', function () {
      expect(() => upgradePatternFromVersion1(null)).to.throw(TypeError)
    })

    it('should throw TypeError if `pattern` is not specified (`undefined`)', function () {
      expect(() => upgradePatternFromVersion1()).to.throw(TypeError)
    })

    it('should throw RangeError if `pattern` does not have `name`', function () {
      expect(() => upgradePatternFromVersion1({
        rows: []
      })).to.throw(RangeError)
    })
  })
})
