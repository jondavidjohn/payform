assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#formatCardExpiry', ->
    it 'should format month shorthand correctly', ->
      assert payform.formatCardExpiry('4'), '04 / '

    it 'should only allow numbers', ->
      assert payform.formatCardExpiry('1d'), '01 / '
