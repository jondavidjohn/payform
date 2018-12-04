###
  Payform Javascript Library

  URL: https://github.com/jondavidjohn/payform
  Author: Jonathan D. Johnson <me@jondavidjohn.com>
  License: MIT
  Version: 1.3.0
###
((name, definition) ->
  if module?
    module.exports = definition()
  else if typeof define is 'function' and typeof define.amd is 'object'
    define(name, definition)
  else
    this[name] = definition()
)('payform', ->

  _getCaretPos = (ele) ->
    if ele.selectionStart?
      return ele.selectionStart
    else if document.selection?
      ele.focus()
      r = document.selection.createRange()
      re = ele.createTextRange()
      rc = re.duplicate()
      re.moveToBookmark(r.getBookmark())
      rc.setEndPoint('EndToStart', re)
      return rc.text.length

  _eventNormalize = (listener) ->
    return (e = window.event) ->
      if e.inputType == 'insertCompositionText' and !e.isComposing
        return
      newEvt =
        target: e.target or e.srcElement
        which: e.which or e.keyCode
        type: e.type
        metaKey: e.metaKey
        ctrlKey: e.ctrlKey
        preventDefault: ->
          if e.preventDefault
            e.preventDefault()
          else
            e.returnValue = false
          return
      listener(newEvt)

  _on = (ele, event, listener) ->
    listener = _eventNormalize(listener)
    if ele.addEventListener?
      ele.addEventListener(event, listener, false)
    else
      ele.attachEvent("on#{event}", listener)

  payform = {}

  # Key Codes
  
  keyCodes = {
    UNKNOWN : 0,
    BACKSPACE : 8,
    PAGE_UP : 33,
    ARROW_LEFT : 37, 
    ARROW_RIGHT : 39,
  }

  # Utils

  defaultFormat = /(\d{1,4})/g

  payform.cards = [
    # Debit cards must come first, since they have more
    # specific patterns than their credit-card equivalents.
    {
      type: 'elo'
      pattern: /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|4(0[5-9]|3[0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8])|9([2-6][0-9]|7[0-8])|541|700|720|901)|651652|655000|655021)/
      format: defaultFormat
      length: [16]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'visaelectron'
      pattern: /^4(026|17500|405|508|844|91[37])/
      format: defaultFormat
      length: [16]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'maestro'
      pattern: /^(5018|5020|5038|6304|6703|6708|6759|676[1-3])/
      format: defaultFormat
      length: [12..19]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'forbrugsforeningen'
      pattern: /^600/
      format: defaultFormat
      length: [16]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'dankort'
      pattern: /^5019/
      format: defaultFormat
      length: [16]
      cvcLength: [3]
      luhn: true
    }
    # Credit cards
    {
      type: 'visa'
      pattern: /^4/
      format: defaultFormat
      length: [13, 16, 19]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'mastercard'
      pattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/
      format: defaultFormat
      length: [16]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'amex'
      pattern: /^3[47]/
      format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/
      length: [15]
      cvcLength: [4]
      luhn: true
    }
    # Must be above dinersclub.
    {
      type: 'hipercard'
      pattern: /^(384100|384140|384160|606282|637095|637568|60(?!11))/
      format: defaultFormat
      length: [14..19]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'dinersclub'
      pattern: /^(36|38|30[0-5])|309/
      format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/
      length: [14]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'discover'
      pattern: /^(6011|65|64[4-9]|622)/
      format: defaultFormat
      length: [16]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'unionpay'
      pattern: /^62/
      format: defaultFormat
      length: [16..19]
      cvcLength: [3]
      luhn: false
    }
    {
      type: 'jcb'
      pattern: /^35/
      format: defaultFormat
      length: [16..19]
      cvcLength: [3]
      luhn: true
    }
    {
      type: 'laser'
      pattern: /^(6706|6771|6709)/
      format: defaultFormat
      length: [16..19]
      cvcLength: [3]
      luhn: true
    }
  ]

  cardFromNumber = (num) ->
    num = (num + '').replace(/\D/g, '')
    return card for card in payform.cards when card.pattern.test(num)

  cardFromType = (type) ->
    return card for card in payform.cards when card.type is type

  getDirectionality = (target) ->
    # Work around Firefox not returning the styles in some edge cases.
    # In Firefox < 62, style can be `null`.
    # In Firefox 62+, `style['direction']` can be an empty string.
    # See https://bugzilla.mozilla.org/show_bug.cgi?id=1467722.
    style = getComputedStyle(target)
    style and style['direction'] or document.dir

  luhnCheck = (num) ->
    odd = true
    sum = 0

    digits = (num + '').split('').reverse()

    for digit in digits
      digit = parseInt(digit, 10)
      digit *= 2 if (odd = !odd)
      digit -= 9 if digit > 9
      sum += digit

    sum % 10 == 0

  hasTextSelected = (target) ->
    # If some text is selected in IE
    if document?.selection?.createRange?
      return true if document.selection.createRange().text
    target.selectionStart? and target.selectionStart isnt target.selectionEnd

  # Private

  # Replace Full-Width Chars

  replaceFullWidthChars = (str = '') ->
    fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19'
    halfWidth = '0123456789'

    value = ''
    chars = str.split('')

    for char in chars
      idx = fullWidth.indexOf(char)
      char = halfWidth[idx] if idx > -1
      value += char

    value

  # Format Card Number

  reFormatCardNumber = (e) ->
    cursor = _getCaretPos(e.target)
    return if e.target.value is ""

    if getDirectionality(e.target) == 'ltr'
      cursor = _getCaretPos(e.target)

    e.target.value = payform.formatCardNumber(e.target.value)

    if getDirectionality(e.target) == 'ltr' and cursor isnt e.target.selectionStart
      cursor = _getCaretPos(e.target)

    if getDirectionality(e.target) == 'rtl' and e.target.value.indexOf('‎\u200e') == -1
      e.target.value = '‎\u200e'.concat(e.target.value)
      
    cursor = _getCaretPos(e.target)
    
    if cursor? and cursor isnt 0 and e.type isnt 'change'
      e.target.setSelectionRange(cursor, cursor)

  formatCardNumber = (e) ->
    # Only format if input is a number
    digit = String.fromCharCode(e.which)
    return unless /^\d+$/.test(digit)

    value  = e.target.value
    card   = cardFromNumber(value + digit)
    length = (value.replace(/\D/g, '') + digit).length

    upperLength = 16
    upperLength = card.length[card.length.length - 1] if card
    return if length >= upperLength

    # Return if focus isn't at the end of the text
    cursor = _getCaretPos(e.target)
    return if cursor and cursor isnt value.length

    if card && card.type is 'amex'
      # AMEX cards are formatted differently
      re = /^(\d{4}|\d{4}\s\d{6})$/
    else
      re = /(?:^|\s)(\d{4})$/

    # If '4242' + 4
    if re.test(value)
      e.preventDefault()
      setTimeout -> e.target.value = "#{value} #{digit}"

    # If '424' + 2
    else if re.test(value + digit)
      e.preventDefault()
      setTimeout -> e.target.value = "#{value + digit} "

  formatBackCardNumber = (e) ->
    value = e.target.value

    # Return unless backspacing
    return unless e.which is keyCodes.BACKSPACE

    # Return if focus isn't at the end of the text
    cursor = _getCaretPos(e.target)
    return if cursor and cursor isnt value.length

    return if (e.target.selectionEnd - e.target.selectionStart) > 1

    # Remove the digit + trailing space
    if /\d\s$/.test(value)
      e.preventDefault()
      setTimeout -> e.target.value = value.replace /\d\s$/, ''
    # Remove digit if ends in space + digit
    else if /\s\d?$/.test(value)
      e.preventDefault()
      setTimeout -> e.target.value = value.replace /\d$/, ''

  # Format Expiry

  reFormatExpiry = (e) ->
    return if e.target.value is ""
    e.target.value = payform.formatCardExpiry(e.target.value)
    if getDirectionality(e.target) == 'rtl' and e.target.value.indexOf('‎\u200e') == -1 
      e.target.value = '‎\u200e'.concat(e.target.value)
    cursor = _getCaretPos(e.target)
    if cursor? and e.type isnt 'change'
      e.target.setSelectionRange(cursor, cursor)

  formatCardExpiry = (e) ->
    # Only format if input is a number
    digit = String.fromCharCode(e.which)
    return unless /^\d+$/.test(digit)

    val = e.target.value + digit

    if /^\d$/.test(val) and val not in ['0', '1']
      e.preventDefault()
      setTimeout -> e.target.value = "0#{val} / "

    else if /^\d\d$/.test(val)
      e.preventDefault()
      setTimeout -> e.target.value = "#{val} / "

  formatForwardExpiry = (e) ->
    digit = String.fromCharCode(e.which)
    return unless /^\d+$/.test(digit)
    val = e.target.value
    if /^\d\d$/.test(val)
      e.target.value = "#{val} / "

  formatForwardSlashAndSpace = (e) ->
    which = String.fromCharCode(e.which)
    return unless which is '/' or which is ' '
    val = e.target.value
    if /^\d$/.test(val) and val isnt '0'
      e.target.value = "0#{val} / "

  formatBackExpiry = (e) ->
    value = e.target.value

    # Return unless backspacing
    return unless e.which is keyCodes.BACKSPACE

    # Return if focus isn't at the end of the text
    cursor = _getCaretPos(e.target)
    return if cursor and cursor isnt value.length

    # Remove the trailing space + last digit
    if /\d\s\/\s$/.test(value)
      e.preventDefault()
      setTimeout -> e.target.value = value.replace(/\d\s\/\s$/, '')

  # Format CVC

  reFormatCVC = (e) ->
    return if e.target.value is ""
    cursor = _getCaretPos(e.target)
    e.target.value = replaceFullWidthChars(e.target.value).replace(/\D/g, '')[0...4]
    if cursor? and e.type isnt 'change'
      e.target.setSelectionRange(cursor, cursor)

  # Restrictions

  restrictNumeric = (e) ->
    # Key event is for a browser shortcut
    return if e.metaKey or e.ctrlKey

    # If keycode is a special char (WebKit)
    return if [keyCodes.UNKNOWN, keyCodes.ARROW_LEFT, keyCodes.ARROW_RIGHT].indexOf(e.which) > -1

    # If char is a special char (Firefox)
    return if e.which < keyCodes.PAGE_UP

    input = String.fromCharCode(e.which)

    # Char is a number
    unless /^\d+$/.test(input)
      e.preventDefault()

  restrictCardNumber = (e) ->
    digit  = String.fromCharCode(e.which)
    return unless /^\d+$/.test(digit)

    return if hasTextSelected(e.target)

    # Restrict number of digits
    value = (e.target.value + digit).replace(/\D/g, '')
    card  = cardFromNumber(value)
    maxLength = if card then card.length[card.length.length - 1] else 16

    if value.length > maxLength
      e.preventDefault()

  restrictExpiry = (e) ->
    digit  = String.fromCharCode(e.which)
    return unless /^\d+$/.test(digit)

    return if hasTextSelected(e.target)

    value = e.target.value + digit
    value = value.replace(/\D/g, '')

    if value.length > 6
      e.preventDefault()

  restrictCVC = (e) ->
    digit  = String.fromCharCode(e.which)
    return unless /^\d+$/.test(digit)
    return if hasTextSelected(e.target)
    val = e.target.value + digit
    if val.length > 4
      e.preventDefault()

  # Public

  # Formatting

  payform.cvcInput = (input) ->
    _on(input, 'keypress', restrictNumeric)
    _on(input, 'keypress', restrictCVC)
    _on(input, 'paste',    reFormatCVC)
    _on(input, 'change',   reFormatCVC)
    _on(input, 'input',    reFormatCVC)

  payform.expiryInput = (input) ->
    _on(input, 'keypress', restrictNumeric)
    _on(input, 'keypress', restrictExpiry)
    _on(input, 'keypress', formatCardExpiry)
    _on(input, 'keypress', formatForwardSlashAndSpace)
    _on(input, 'keypress', formatForwardExpiry)
    _on(input, 'keydown',  formatBackExpiry)
    _on(input, 'change',   reFormatExpiry)
    _on(input, 'input',    reFormatExpiry)

  payform.cardNumberInput = (input) ->
    _on(input, 'keypress', restrictNumeric)
    _on(input, 'keypress', restrictCardNumber)
    _on(input, 'keypress', formatCardNumber)
    _on(input, 'keydown',  formatBackCardNumber)
    _on(input, 'paste',    reFormatCardNumber)
    _on(input, 'change',   reFormatCardNumber)
    _on(input, 'input',    reFormatCardNumber)

  payform.numericInput = (input) ->
    _on(input, 'keypress', restrictNumeric)
    _on(input, 'paste',    restrictNumeric)
    _on(input, 'change',   restrictNumeric)
    _on(input, 'input',    restrictNumeric)

  # Validations

  payform.parseCardExpiry = (value) ->
    value = value.replace(/\s/g, '')
    [month, year] = value.split('/', 2)

    # Allow for year shortcut
    if year?.length is 2 and /^\d+$/.test(year)
      prefix = (new Date).getFullYear()
      prefix = prefix.toString()[0..1]
      year   = prefix + year

    # Remove left-to-right mark LTR invisible unicode control character used in right-to-left contexts
    month = parseInt(month.replace(/[\u200e]/g, ""), 10);
    year  = parseInt(year, 10)

    month: month, year: year

  payform.validateCardNumber = (num) ->
    num = (num + '').replace(/\s+|-/g, '')
    return false unless /^\d+$/.test(num)

    card = cardFromNumber(num)
    return false unless card

    num.length in card.length and
      (card.luhn is false or luhnCheck(num))

  payform.validateCardExpiry = (month, year) ->
    # Allow passing an object
    if typeof month is 'object' and 'month' of month
      {month, year} = month

    return false unless month and year

    month = String(month).trim()
    year  = String(year).trim()

    return false unless /^\d+$/.test(month)
    return false unless /^\d+$/.test(year)
    return false unless 1 <= month <= 12

    if year.length == 2
      if year < 70
        year = "20#{year}"
      else
        year = "19#{year}"

    return false unless year.length == 4

    expiry      = new Date(year, month)
    currentTime = new Date

    # Months start from 0 in JavaScript
    expiry.setMonth(expiry.getMonth() - 1)

    # The cc expires at the end of the month,
    # so we need to make the expiry the first day
    # of the month after
    expiry.setMonth(expiry.getMonth() + 1, 1)

    expiry > currentTime

  payform.validateCardCVC = (cvc, type) ->
    cvc = String(cvc).trim()
    return false unless /^\d+$/.test(cvc)

    card = cardFromType(type)
    if card?
      # Check against a explicit card type
      cvc.length in card.cvcLength
    else
      # Check against all types
      cvc.length >= 3 and cvc.length <= 4

  payform.parseCardType = (num) ->
    return null unless num
    cardFromNumber(num)?.type or null

  payform.formatCardNumber = (num) ->
    num = replaceFullWidthChars(num)
    num = num.replace(/\D/g, '')
    card = cardFromNumber(num)
    return num unless card

    upperLength = card.length[card.length.length - 1]
    num = num[0...upperLength]

    if card.format.global
      num.match(card.format)?.join(' ')
    else
      groups = card.format.exec(num)
      return unless groups?
      groups.shift()
      groups = groups.filter(Boolean)
      groups.join(' ')

  payform.formatCardExpiry = (expiry) ->
    expiry = replaceFullWidthChars(expiry)
    parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/)
    return '' unless parts

    mon = parts[1] || ''
    sep = parts[2] || ''
    year = parts[3] || ''

    if year.length > 0
      sep = ' / '

    else if sep is ' /'
      mon = mon.substring(0, 1)
      sep = ''

    else if mon.length == 2 or sep.length > 0
      sep = ' / '

    else if mon.length == 1 and mon not in ['0', '1']
      mon = "0#{mon}"
      sep = ' / '

    return mon + sep + year

  payform
)
