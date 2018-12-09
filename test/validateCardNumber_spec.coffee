assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#validateCardNumber()', ->
    it 'should fail if empty', ->
      topic = payform.validateCardNumber ''
      assert.equal topic, false

    it 'should fail if is a bunch of spaces', ->
      topic = payform.validateCardNumber '                 '
      assert.equal topic, false

    it 'should success if is valid', ->
      topic = payform.validateCardNumber '4242424242424242'
      assert.equal topic, true

    it 'that has dashes in it but is valid', ->
      topic = payform.validateCardNumber '4242-4242-4242-4242'
      assert.equal topic, true

    it 'should succeed if it has spaces in it but is valid', ->
      topic = payform.validateCardNumber '4242 4242 4242 4242'
      assert.equal topic, true

    it 'that does not pass the luhn checker', ->
      topic = payform.validateCardNumber '4242424242424241'
      assert.equal topic, false

    it 'should fail if is more than 16 digits', ->
      topic = payform.validateCardNumber '42424242424242424'
      assert.equal topic, false

    it 'should fail if is less than 10 digits', ->
      topic = payform.validateCardNumber '424242424'
      assert.equal topic, false

    it 'should fail with non-digits', ->
      topic = payform.validateCardNumber '4242424e42424241'
      assert.equal topic, false

    it 'should validate for all card types', ->
      assert(payform.validateCardNumber('4917300800000000'), 'visaelectron')

      assert(payform.validateCardNumber('6759649826438453'), 'maestro')

      assert(payform.validateCardNumber('6007220000000004'), 'forbrugsforeningen')

      assert(payform.validateCardNumber('5019717010103742'), 'dankort')

      assert(payform.validateCardNumber('4111111111111111'), 'visa')
      assert(payform.validateCardNumber('4012888888881881'), 'visa')
      assert(payform.validateCardNumber('4222222222222'), 'visa')
      assert(payform.validateCardNumber('4462030000000000'), 'visa')
      assert(payform.validateCardNumber('4484070000000000'), 'visa')

      assert(payform.validateCardNumber('5555555555554444'), 'mastercard')
      assert(payform.validateCardNumber('5454545454545454'), 'mastercard')

      assert(payform.validateCardNumber('378282246310005'), 'amex')
      assert(payform.validateCardNumber('371449635398431'), 'amex')
      assert(payform.validateCardNumber('378734493671000'), 'amex')

      assert(payform.validateCardNumber('30569309025904'), 'dinersclub')
      assert(payform.validateCardNumber('38520000023237'), 'dinersclub')
      assert(payform.validateCardNumber('36700102000000'), 'dinersclub')
      assert(payform.validateCardNumber('36148900647913'), 'dinersclub')
      assert(payform.validateCardNumber('30932281347102'), 'dinersclub')

      assert(payform.validateCardNumber('6011111111111117'), 'discover')
      assert(payform.validateCardNumber('6011000990139424'), 'discover')

      assert(payform.validateCardNumber('6271136264806203568'), 'unionpay')
      assert(payform.validateCardNumber('6204679475679144515'), 'unionpay')
      assert(payform.validateCardNumber('6216657720782466507'), 'unionpay')

      assert(payform.validateCardNumber('3530111333300000'), 'jcb')
      assert(payform.validateCardNumber('3566002020360505'), 'jcb')
      assert(payform.validateCardNumber('6362970000457013'), 'elo')

      assert(payform.validateCardNumber('6062821086773091'), 'hipercard')
      assert(payform.validateCardNumber('6375683647504601'), 'hipercard')
      assert(payform.validateCardNumber('6370957513839696'), 'hipercard')
      assert(payform.validateCardNumber('6375688248373892'), 'hipercard')
      assert(payform.validateCardNumber('6012135281693108'), 'hipercard')
      assert(payform.validateCardNumber('38410036464094'), 'hipercard')
      assert(payform.validateCardNumber('38414050328938'), 'hipercard')
