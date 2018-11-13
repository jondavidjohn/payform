assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#formatCardNumber', ->
    it 'should format cc number correctly', ->
      assert.equal payform.formatCardNumber('42424'), '4242 4'
      assert.equal payform.formatCardNumber('42424242'), '4242 4242'
      assert.equal payform.formatCardNumber('4242424242'), '4242 4242 42'
      assert.equal payform.formatCardNumber('4242424242424242'), '4242 4242 4242 4242'
      assert.equal payform.formatCardNumber('4242424242424242424'), '4242 4242 4242 4242 424'

    it 'should format amex cc number correctly', ->
      assert.equal payform.formatCardNumber('37828'), '3782 8'
      assert.equal payform.formatCardNumber('3782822'), '3782 822'
      assert.equal payform.formatCardNumber('378282246310'), '3782 822463 10'
      assert.equal payform.formatCardNumber('378282246310005'), '3782 822463 10005'

    it 'should format full-width cc number correctly',  ->
      assert.equal payform.formatCardNumber('\uff14\uff12\uff14\uff12'), '4242'
      assert.equal payform.formatCardNumber('\uff14\uff12\uff14\uff12\uff14\uff12'), '4242 42'

    it 'should only allow numbers', ->
      assert.equal payform.formatCardNumber('42424242424242A22'), '4242 4242 4242 4222'
