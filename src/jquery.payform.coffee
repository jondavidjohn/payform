payform = require './payform'

do ($ = window.jQuery || window.Zepto) ->

  $.payform = payform
  $.payform.fn =
    formatCardNumber: ->
      payform.cardNumberInput @get(0)
    formatCardExpiry: ->
      payform.expiryInput @get(0)
    formatCardCVC: ->
      payform.cvcInput @get(0)
    formatNumeric: ->
      payform.numericInput @get(0)
    detachFormatCardNumber: ->
      payform.detachCardNumberInput @get(0)
    detachFormatCardExpiry: ->
      payform.detachExpiryInput @get(0)
    detachFormatCardCVC: ->
      payform.detachCvcInput @get(0)
    detachFormatNumeric: ->
      payform.detachNumericInput @get(0)

  $.fn.payform = (method) ->
    $.payform.fn[method].call(this) if $.payform.fn[method]?
    return this
