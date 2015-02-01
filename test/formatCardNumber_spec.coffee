assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#formatCardNumber', ->
    it 'should format cc number correctly', ->
      assert payform.formatCardNumber('42424'), '4242 4'
      assert payform.formatCardNumber('42424242'), '4242 4242'
      assert payform.formatCardNumber('4242424242'), '4242 4242 42'
      assert payform.formatCardNumber('4242424242424242'), '4242 4242 4242 4242'
    it 'should format amex cc number correctly', ->
      assert payform.formatCardNumber('37828'), '3782 8'
