assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#cardExpiryVal', ->
    it 'should parse string expiry', ->
      topic = payform.cardExpiryVal '03 / 2025'
      assert.deepEqual topic, month: 3, year: 2025

    it 'should support shorthand year', ->
      topic = payform.cardExpiryVal '05/04'
      assert.deepEqual topic, month: 5, year: 2004

    it 'should return NaN when it cannot parse', ->
      topic = payform.cardExpiryVal '05/dd'
      assert isNaN(topic.year)
