payform = require './payform'

do ($ = window.jQuery || window.Zepto) ->

  $.payform = payform
  $.payform.fn =
    formatCardNumber: ->
      payform.cardNumberInput @get(0)
    formatCardExpiry: (option)->
      payform.expiryInput @get(0), option
    formatCardCVC: ->
      payform.cvcInput @get(0)
    formatNumeric: ->
      payform.numericInput @get(0)

  $.fn.payform = (method, option) ->
    $.payform.fn[method].call(this, option) if $.payform.fn[method]?
    return this
