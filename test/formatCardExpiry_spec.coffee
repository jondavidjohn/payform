assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#formatCardExpiry', ->
    it 'should format month shorthand correctly', ->
      assert.equal payform.formatCardExpiry('4'), '04 / '

    it 'should only allow numbers', ->
      assert.equal payform.formatCardExpiry('1d'), '1 / '

    it 'should format full-width expiry correctly',  ->
      assert.equal payform.formatCardExpiry('\uff18'), '08 / '
      assert.equal payform.formatCardExpiry('\uff10\uff17\uff12\uff10\uff11\uff18'), '07 / 2018'
      assert.equal payform.formatCardExpiry('\uff10\uff18\uff12\uff10\uff11\uff18\uff12\uff10\uff11\uff18'), '08 / 2018'
