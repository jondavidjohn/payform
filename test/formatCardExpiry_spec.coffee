assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#formatCardExpiry', ->
    it 'should format month shorthand correctly', ->
      assert payform.formatCardExpiry('4'), '04 / '

    it 'should only allow numbers', ->
      assert payform.formatCardExpiry('1d'), '01 / '

    it 'should format full-width expiry correctly',  ->
      assert payform.formatCardExpiry('\uff10\uff18'), '08 /'
      assert payform.formatCardNumber('\uff10\uff18\uff11\uff15'), '08 / 15'
