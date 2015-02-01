assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#cardType()', ->
    it 'should return Visa that begins with 40', ->
      topic = payform.cardType '4012121212121212'
      assert.equal topic, 'visa'

    it 'that begins with 5 should return MasterCard', ->
      topic = payform.cardType '5555555555554444'
      assert.equal topic, 'mastercard'

    it 'that begins with 34 should return American Express', ->
      topic = payform.cardType '3412121212121212'
      assert.equal topic, 'amex'

    it 'that is not numbers should return null', ->
      topic = payform.cardType 'aoeu'
      assert.equal topic, null

    it 'that has unrecognized beginning numbers should return null', ->
      topic = payform.cardType 'aoeu'
      assert.equal topic, null

    it 'should return correct type for all test numbers', ->
      assert.equal(payform.cardType('4917300800000000'), 'visaelectron')

      assert.equal(payform.cardType('6759649826438453'), 'maestro')

      assert.equal(payform.cardType('6007220000000004'), 'forbrugsforeningen')

      assert.equal(payform.cardType('5019717010103742'), 'dankort')

      assert.equal(payform.cardType('4111111111111111'), 'visa')
      assert.equal(payform.cardType('4012888888881881'), 'visa')
      assert.equal(payform.cardType('4222222222222'), 'visa')
      assert.equal(payform.cardType('4462030000000000'), 'visa')
      assert.equal(payform.cardType('4484070000000000'), 'visa')

      assert.equal(payform.cardType('5555555555554444'), 'mastercard')
      assert.equal(payform.cardType('5454545454545454'), 'mastercard')

      assert.equal(payform.cardType('378282246310005'), 'amex')
      assert.equal(payform.cardType('371449635398431'), 'amex')
      assert.equal(payform.cardType('378734493671000'), 'amex')

      assert.equal(payform.cardType('30569309025904'), 'dinersclub')
      assert.equal(payform.cardType('38520000023237'), 'dinersclub')
      assert.equal(payform.cardType('36700102000000'), 'dinersclub')
      assert.equal(payform.cardType('36148900647913'), 'dinersclub')

      assert.equal(payform.cardType('6011111111111117'), 'discover')
      assert.equal(payform.cardType('6011000990139424'), 'discover')

      assert.equal(payform.cardType('6271136264806203568'), 'unionpay')
      assert.equal(payform.cardType('6236265930072952775'), 'unionpay')
      assert.equal(payform.cardType('6204679475679144515'), 'unionpay')
      assert.equal(payform.cardType('6216657720782466507'), 'unionpay')

      assert.equal(payform.cardType('3530111333300000'), 'jcb')
      assert.equal(payform.cardType('3566002020360505'), 'jcb')

  describe '#cards', ->
    it 'should expose an array of standard card types', ->
      cards = payform.cards
      assert Array.isArray(cards)

      visa = card for card in cards when card.type is 'visa'
      assert.notEqual visa, null

    it 'should support new card types', ->
      wing =
        type: 'wing'
        pattern: /^501818/
        length: [16]
        luhn: false

      payform.cards.unshift wing

      wingCard = '5018 1818 1818 1818'
      assert.equal payform.cardType(wingCard), 'wing'
      assert.equal payform.validateCardNumber(wingCard), true
