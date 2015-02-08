payform = require './payform'

do ($ = jQuery) ->

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

  $.fn.payform = (method) ->
    $.payform.fn[method].call(this) if $.payform.fn[method]?
    return this
