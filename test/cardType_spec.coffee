assert  = require('assert')
payform = require('../src/payform')

describe 'payform', ->
  describe '#parseCardType()', ->
    it 'should return Visa that begins with 40', ->
      topic = payform.parseCardType '4012121212121212'
      assert.equal topic, 'visa'

    it 'that begins with 5 should return MasterCard', ->
      topic = payform.parseCardType '5555555555554444'
      assert.equal topic, 'mastercard'

    it 'that begins with 34 should return American Express', ->
      topic = payform.parseCardType '3412121212121212'
      assert.equal topic, 'amex'

    it 'that is not numbers should return null', ->
      topic = payform.parseCardType 'aoeu'
      assert.equal topic, null

    it 'that has unrecognized beginning numbers should return null', ->
      topic = payform.parseCardType 'aoeu'
      assert.equal topic, null

    it 'should return correct type for all test numbers', ->
      assert.equal(payform.parseCardType('4917300800000000'), 'visaelectron')

      assert.equal(payform.parseCardType('6759649826438453'), 'maestro')

      assert.equal(payform.parseCardType('6007220000000004'), 'forbrugsforeningen')

      assert.equal(payform.parseCardType('5019717010103742'), 'dankort')

      assert.equal(payform.parseCardType('4111111111111111'), 'visa')
      assert.equal(payform.parseCardType('4012888888881881'), 'visa')
      assert.equal(payform.parseCardType('4222222222222'), 'visa')
      assert.equal(payform.parseCardType('4462030000000000'), 'visa')
      assert.equal(payform.parseCardType('4484070000000000'), 'visa')

      assert.equal(payform.parseCardType('5555555555554444'), 'mastercard')
      assert.equal(payform.parseCardType('5454545454545454'), 'mastercard')

      assert.equal(payform.parseCardType('378282246310005'), 'amex')
      assert.equal(payform.parseCardType('371449635398431'), 'amex')
      assert.equal(payform.parseCardType('378734493671000'), 'amex')

      assert.equal(payform.parseCardType('30569309025904'), 'dinersclub')
      assert.equal(payform.parseCardType('38520000023237'), 'dinersclub')
      assert.equal(payform.parseCardType('36700102000000'), 'dinersclub')
      assert.equal(payform.parseCardType('36148900647913'), 'dinersclub')

      assert.equal(payform.parseCardType('6011111111111117'), 'discover')
      assert.equal(payform.parseCardType('6011000990139424'), 'discover')

      assert.equal(payform.parseCardType('6271136264806203568'), 'unionpay')
      assert.equal(payform.parseCardType('6236265930072952775'), 'unionpay')
      assert.equal(payform.parseCardType('6204679475679144515'), 'unionpay')
      assert.equal(payform.parseCardType('6216657720782466507'), 'unionpay')

      assert.equal(payform.parseCardType('3530111333300000'), 'jcb')
      assert.equal(payform.parseCardType('3566002020360505'), 'jcb')

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
      assert.equal payform.parseCardType(wingCard), 'wing'
      assert.equal payform.validateCardNumber(wingCard), true
