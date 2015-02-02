assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#parseCardExpiry', ->
    it 'should parse string expiry', ->
      topic = payform.parseCardExpiry '03 / 2025'
      assert.deepEqual topic, month: 3, year: 2025

    it 'should support shorthand year', ->
      topic = payform.parseCardExpiry '05/04'
      assert.deepEqual topic, month: 5, year: 2004

    it 'should return NaN when it cannot parse', ->
      topic = payform.parseCardExpiry '05/dd'
      assert isNaN(topic.year)
