assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#validateCardCVC', ->
    it 'should fail if is empty', ->
      topic = payform.validateCardCVC ''
      assert.equal topic, false

    it 'should pass if is valid', ->
      topic = payform.validateCardCVC '123'
      assert.equal topic, true

    it 'should fail with non-digits', ->
      topic = payform.validateCardCVC '12e'
      assert.equal topic, false

    it 'should fail with less than 3 digits', ->
      topic = payform.validateCardCVC '12'
      assert.equal topic, false

    it 'should fail with more than 4 digits', ->
      topic = payform.validateCardCVC '12345'
      assert.equal topic, false

    it 'should validate a three digit number with no card type', ->
      topic = payform.validateCardCVC('123')
      assert.equal topic, true

    it 'should fail a three digit number with card type amex', ->
      topic = payform.validateCardCVC('123', 'amex')
      assert.equal topic, false

    it 'should validate a four digit number with card type amex', ->
      topic = payform.validateCardCVC('1234', 'amex')
      assert.equal topic, true

    it 'should validate a three digit number with card type other than amex', ->
      topic = payform.validateCardCVC('123', 'visa')
      assert.equal topic, true

    it 'should not validate a four digit number with a card type other than amex', ->
      topic = payform.validateCardCVC('1234', 'visa')
      assert.equal topic, false

    it 'should validate a four digit number with card type amex', ->
      topic = payform.validateCardCVC('1234', 'amex')
      assert.equal topic, true

    it 'should not validate a number larger than 4 digits', ->
      topic = payform.validateCardCVC('12344')
      assert.equal topic, false
