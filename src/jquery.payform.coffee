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

  $.fn.payform = ->
    args   = [].slice.call(arguments)
    method = args.shift()
    $.payform.fn[method].apply(this, args)
    return this
