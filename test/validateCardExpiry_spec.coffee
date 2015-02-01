assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#validateCardExpiry()', ->
    it 'should fail expires is before the current year', ->
      currentTime = new Date()
      topic = payform.validateCardExpiry currentTime.getMonth() + 1, currentTime.getFullYear() - 1
      assert.equal topic, false

    it 'that expires in the current year but before current month', ->
      currentTime = new Date()
      topic = payform.validateCardExpiry currentTime.getMonth(), currentTime.getFullYear()
      assert.equal topic, false

    it 'that has an invalid month', ->
      currentTime = new Date()
      topic = payform.validateCardExpiry 13, currentTime.getFullYear()
      assert.equal topic, false

    it 'that is this year and month', ->
      currentTime = new Date()
      topic = payform.validateCardExpiry currentTime.getMonth() + 1, currentTime.getFullYear()
      assert.equal topic, true

    it 'that is just after this month', ->
      # Remember - months start with 0 in JavaScript!
      currentTime = new Date()
      topic = payform.validateCardExpiry currentTime.getMonth() + 1, currentTime.getFullYear()
      assert.equal topic, true

    it 'that is after this year', ->
      currentTime = new Date()
      topic = payform.validateCardExpiry currentTime.getMonth() + 1, currentTime.getFullYear() + 1
      assert.equal topic, true

    it 'that is a two-digit year', ->
      currentTime = new Date()
      topic = payform.validateCardExpiry currentTime.getMonth() + 1, ('' + currentTime.getFullYear())[0...2]
      assert.equal topic, true

    it 'that is a two-digit year in the past (i.e. 1990s)', ->
      currentTime = new Date()
      topic = payform.validateCardExpiry currentTime.getMonth() + 1, 99
      assert.equal topic, false

    it 'that has string numbers', ->
      currentTime = new Date()
      currentTime.setFullYear(currentTime.getFullYear() + 1, currentTime.getMonth() + 2)
      topic = payform.validateCardExpiry currentTime.getMonth() + 1 + '', currentTime.getFullYear() + ''
      assert.equal topic, true

    it 'that has non-numbers', ->
      topic = payform.validateCardExpiry 'h12', '3300'
      assert.equal topic, false

    it 'should fail if year or month is NaN', ->
      topic = payform.validateCardExpiry '12', NaN
      assert.equal topic, false

    it 'should support year shorthand', ->
      assert.equal payform.validateCardExpiry('05', '20'), true
