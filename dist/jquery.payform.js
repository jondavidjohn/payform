(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var payform;

payform = require(2);

(function($) {
  $.payform = payform;
  $.payform.fn = {
    formatCardNumber: function() {
      return payform.cardNumberInput(this.get(0));
    },
    formatCardExpiry: function() {
      return payform.expiryInput(this.get(0));
    },
    formatCardCVC: function() {
      return payform.cvcInput(this.get(0));
    },
    formatNumeric: function() {
      return payform.numericInput(this.get(0));
    },
    detachFormatCardNumber: function() {
      return payform.detachCardNumberInput(this.get(0));
    },
    detachFormatCardExpiry: function() {
      return payform.detachExpiryInput(this.get(0));
    },
    detachFormatCardCVC: function() {
      return payform.detachCvcInput(this.get(0));
    },
    detachFormatNumeric: function() {
      return payform.detachNumericInput(this.get(0));
    }
  };
  return $.fn.payform = function(method) {
    if ($.payform.fn[method] != null) {
      $.payform.fn[method].call(this);
    }
    return this;
  };
})(window.jQuery || window.Zepto);


},{"2":2}],2:[function(require,module,exports){

/*
  Payform Javascript Library

  URL: https://github.com/jondavidjohn/payform
  Author: Jonathan D. Johnson <me@jondavidjohn.com>
  License: MIT
  Version: 1.4.0
 */
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function(name, definition) {
  if (typeof module !== "undefined" && module !== null) {
    return module.exports = definition();
  } else if (typeof define === 'function' && typeof define.amd === 'object') {
    return define(name, definition);
  } else {
    return this[name] = definition();
  }
})('payform', function() {
  var _eventNormalize, _getCaretPos, _off, _on, attachEvents, cardFromNumber, cardFromType, defaultFormat, eventList, formatBackCardNumber, formatBackExpiry, formatCardExpiry, formatCardNumber, formatForwardExpiry, formatForwardSlashAndSpace, getDirectionality, hasTextSelected, keyCodes, luhnCheck, payform, reFormatCVC, reFormatCardNumber, reFormatExpiry, replaceFullWidthChars, restrictCVC, restrictCardNumber, restrictExpiry, restrictNumeric;
  _getCaretPos = function(ele) {
    var r, rc, re;
    if (ele.selectionStart != null) {
      return ele.selectionStart;
    } else if (document.selection != null) {
      ele.focus();
      r = document.selection.createRange();
      re = ele.createTextRange();
      rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint('EndToStart', re);
      return rc.text.length;
    }
  };
  _eventNormalize = function(listener) {
    return function(e) {
      var newEvt;
      if (e == null) {
        e = window.event;
      }
      if (e.inputType === 'insertCompositionText' && !e.isComposing) {
        return;
      }
      newEvt = {
        target: e.target || e.srcElement,
        which: e.which || e.keyCode,
        type: e.type,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        preventDefault: function() {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      };
      return listener(newEvt);
    };
  };
  _on = function(ele, event, listener) {
    if (ele.addEventListener != null) {
      return ele.addEventListener(event, listener, false);
    } else {
      return ele.attachEvent("on" + event, listener);
    }
  };
  _off = function(ele, event, listener) {
    if (ele.removeEventListener != null) {
      return ele.removeEventListener(event, listener, false);
    } else {
      return ele.detachEvent("on" + event, listener);
    }
  };
  payform = {};
  keyCodes = {
    UNKNOWN: 0,
    BACKSPACE: 8,
    PAGE_UP: 33,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39
  };
  defaultFormat = /(\d{1,4})/g;
  payform.cards = [
    {
      type: 'elo',
      pattern: /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|4(0[5-9]|3[0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8])|9([2-6][0-9]|7[0-8])|541|700|720|901)|651652|655000|655021)/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'visaelectron',
      pattern: /^4(026|17500|405|508|844|91[37])/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'maestro',
      pattern: /^(5018|5020|5038|6304|6390[0-9]{2}|67[0-9]{4})/,
      format: defaultFormat,
      length: [12, 13, 14, 15, 16, 17, 18, 19],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'forbrugsforeningen',
      pattern: /^600/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'dankort',
      pattern: /^5019/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'visa',
      pattern: /^4/,
      format: defaultFormat,
      length: [13, 16, 19],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'mastercard',
      pattern: /^(5[1-5][0-9]{4}|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)([0-9]{2})/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'amex',
      pattern: /^3[47]/,
      format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
      length: [15],
      cvcLength: [4],
      luhn: true
    }, {
      type: 'hipercard',
      pattern: /^(384100|384140|384160|606282|637095|637568|60(?!11))/,
      format: defaultFormat,
      length: [14, 15, 16, 17, 18, 19],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'dinersclub',
      pattern: /^(36|38|30[0-5])/,
      format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
      length: [14],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'discover',
      pattern: /^(6011|65|64[4-9]|622)/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'unionpay',
      pattern: /^62/,
      format: defaultFormat,
      length: [16, 17, 18, 19],
      cvcLength: [3],
      luhn: false
    }, {
      type: 'jcb',
      pattern: /^35/,
      format: defaultFormat,
      length: [16, 17, 18, 19],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'laser',
      pattern: /^(6706|6771|6709)/,
      format: defaultFormat,
      length: [16, 17, 18, 19],
      cvcLength: [3],
      luhn: true
    }
  ];
  cardFromNumber = function(num) {
    var card, i, len, ref;
    num = (num + '').replace(/\D/g, '');
    ref = payform.cards;
    for (i = 0, len = ref.length; i < len; i++) {
      card = ref[i];
      if (card.pattern.test(num)) {
        return card;
      }
    }
  };
  cardFromType = function(type) {
    var card, i, len, ref;
    ref = payform.cards;
    for (i = 0, len = ref.length; i < len; i++) {
      card = ref[i];
      if (card.type === type) {
        return card;
      }
    }
  };
  getDirectionality = function(target) {
    var style;
    style = getComputedStyle(target);
    return style && style['direction'] || document.dir;
  };
  luhnCheck = function(num) {
    var digit, digits, i, len, odd, sum;
    odd = true;
    sum = 0;
    digits = (num + '').split('').reverse();
    for (i = 0, len = digits.length; i < len; i++) {
      digit = digits[i];
      digit = parseInt(digit, 10);
      if ((odd = !odd)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };
  hasTextSelected = function(target) {
    var ref;
    if ((typeof document !== "undefined" && document !== null ? (ref = document.selection) != null ? ref.createRange : void 0 : void 0) != null) {
      if (document.selection.createRange().text) {
        return true;
      }
    }
    return (target.selectionStart != null) && target.selectionStart !== target.selectionEnd;
  };
  replaceFullWidthChars = function(str) {
    var char, chars, fullWidth, halfWidth, i, idx, len, value;
    if (str == null) {
      str = '';
    }
    fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19';
    halfWidth = '0123456789';
    value = '';
    chars = str.split('');
    for (i = 0, len = chars.length; i < len; i++) {
      char = chars[i];
      idx = fullWidth.indexOf(char);
      if (idx > -1) {
        char = halfWidth[idx];
      }
      value += char;
    }
    return value;
  };
  reFormatCardNumber = function(e) {
    var cursor;
    cursor = _getCaretPos(e.target);
    if (e.target.value === "") {
      return;
    }
    if (getDirectionality(e.target) === 'ltr') {
      cursor = _getCaretPos(e.target);
    }
    e.target.value = payform.formatCardNumber(e.target.value);
    if (getDirectionality(e.target) === 'ltr' && cursor !== e.target.selectionStart) {
      cursor = _getCaretPos(e.target);
    }
    if (getDirectionality(e.target) === 'rtl' && e.target.value.indexOf('‎\u200e') === -1) {
      e.target.value = '‎\u200e'.concat(e.target.value);
    }
    cursor = _getCaretPos(e.target);
    if ((cursor != null) && cursor !== 0 && e.type !== 'change') {
      return e.target.setSelectionRange(cursor, cursor);
    }
  };
  formatCardNumber = function(e) {
    var card, cursor, digit, length, re, upperLength, value;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    value = e.target.value;
    card = cardFromNumber(value + digit);
    length = (value.replace(/\D/g, '') + digit).length;
    upperLength = 16;
    if (card) {
      upperLength = card.length[card.length.length - 1];
    }
    if (length >= upperLength) {
      return;
    }
    cursor = _getCaretPos(e.target);
    if (cursor && cursor !== value.length) {
      return;
    }
    if (card && card.type === 'amex') {
      re = /^(\d{4}|\d{4}\s\d{6})$/;
    } else {
      re = /(?:^|\s)(\d{4})$/;
    }
    if (re.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return e.target.value = value + " " + digit;
      });
    } else if (re.test(value + digit)) {
      e.preventDefault();
      return setTimeout(function() {
        return e.target.value = (value + digit) + " ";
      });
    }
  };
  formatBackCardNumber = function(e) {
    var cursor, value;
    value = e.target.value;
    if (e.which !== keyCodes.BACKSPACE) {
      return;
    }
    cursor = _getCaretPos(e.target);
    if (cursor && cursor !== value.length) {
      return;
    }
    if ((e.target.selectionEnd - e.target.selectionStart) > 1) {
      return;
    }
    if (/\d\s$/.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return e.target.value = value.replace(/\d\s$/, '');
      });
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return e.target.value = value.replace(/\d$/, '');
      });
    }
  };
  reFormatExpiry = function(e) {
    var cursor;
    if (e.target.value === "") {
      return;
    }
    e.target.value = payform.formatCardExpiry(e.target.value);
    if (getDirectionality(e.target) === 'rtl' && e.target.value.indexOf('‎\u200e') === -1) {
      e.target.value = '‎\u200e'.concat(e.target.value);
    }
    cursor = _getCaretPos(e.target);
    if ((cursor != null) && e.type !== 'change') {
      return e.target.setSelectionRange(cursor, cursor);
    }
  };
  formatCardExpiry = function(e) {
    var digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    val = e.target.value + digit;
    if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
      e.preventDefault();
      return setTimeout(function() {
        return e.target.value = "0" + val + " / ";
      });
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      return setTimeout(function() {
        return e.target.value = val + " / ";
      });
    }
  };
  formatForwardExpiry = function(e) {
    var digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    val = e.target.value;
    if (/^\d\d$/.test(val)) {
      return e.target.value = val + " / ";
    }
  };
  formatForwardSlashAndSpace = function(e) {
    var val, which;
    which = String.fromCharCode(e.which);
    if (!(which === '/' || which === ' ')) {
      return;
    }
    val = e.target.value;
    if (/^\d$/.test(val) && val !== '0') {
      return e.target.value = "0" + val + " / ";
    }
  };
  formatBackExpiry = function(e) {
    var cursor, value;
    value = e.target.value;
    if (e.which !== keyCodes.BACKSPACE) {
      return;
    }
    cursor = _getCaretPos(e.target);
    if (cursor && cursor !== value.length) {
      return;
    }
    if (/\d\s\/\s$/.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return e.target.value = value.replace(/\d\s\/\s$/, '');
      });
    }
  };
  reFormatCVC = function(e) {
    var cursor;
    if (e.target.value === "") {
      return;
    }
    cursor = _getCaretPos(e.target);
    e.target.value = replaceFullWidthChars(e.target.value).replace(/\D/g, '').slice(0, 4);
    if ((cursor != null) && e.type !== 'change') {
      return e.target.setSelectionRange(cursor, cursor);
    }
  };
  restrictNumeric = function(e) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return;
    }
    if ([keyCodes.UNKNOWN, keyCodes.ARROW_LEFT, keyCodes.ARROW_RIGHT].indexOf(e.which) > -1) {
      return;
    }
    if (e.which < keyCodes.PAGE_UP) {
      return;
    }
    input = String.fromCharCode(e.which);
    if (!/^\d+$/.test(input)) {
      return e.preventDefault();
    }
  };
  restrictCardNumber = function(e) {
    var card, digit, maxLength, value;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected(e.target)) {
      return;
    }
    value = (e.target.value + digit).replace(/\D/g, '');
    card = cardFromNumber(value);
    maxLength = card ? card.length[card.length.length - 1] : 16;
    if (value.length > maxLength) {
      return e.preventDefault();
    }
  };
  restrictExpiry = function(e) {
    var digit, value;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected(e.target)) {
      return;
    }
    value = e.target.value + digit;
    value = value.replace(/\D/g, '');
    if (value.length > 6) {
      return e.preventDefault();
    }
  };
  restrictCVC = function(e) {
    var digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected(e.target)) {
      return;
    }
    val = e.target.value + digit;
    if (val.length > 4) {
      return e.preventDefault();
    }
  };
  eventList = {
    cvcInput: [
      {
        eventName: 'keypress',
        eventHandler: _eventNormalize(restrictNumeric)
      }, {
        eventName: 'keypress',
        eventHandler: _eventNormalize(restrictCVC)
      }, {
        eventName: 'paste',
        eventHandler: _eventNormalize(reFormatCVC)
      }, {
        eventName: 'change',
        eventHandler: _eventNormalize(reFormatCVC)
      }, {
        eventName: 'input',
        eventHandler: _eventNormalize(reFormatCVC)
      }
    ],
    expiryInput: [
      {
        eventName: 'keypress',
        eventHandler: _eventNormalize(restrictNumeric)
      }, {
        eventName: 'keypress',
        eventHandler: _eventNormalize(restrictExpiry)
      }, {
        eventName: 'keypress',
        eventHandler: _eventNormalize(formatCardExpiry)
      }, {
        eventName: 'keypress',
        eventHandler: _eventNormalize(formatForwardSlashAndSpace)
      }, {
        eventName: 'keypress',
        eventHandler: _eventNormalize(formatForwardExpiry)
      }, {
        eventName: 'keydown',
        eventHandler: _eventNormalize(formatBackExpiry)
      }, {
        eventName: 'change',
        eventHandler: _eventNormalize(reFormatExpiry)
      }, {
        eventName: 'input',
        eventHandler: _eventNormalize(reFormatExpiry)
      }
    ],
    cardNumberInput: [
      {
        eventName: 'keypress',
        eventHandler: _eventNormalize(restrictNumeric)
      }, {
        eventName: 'keypress',
        eventHandler: _eventNormalize(restrictCardNumber)
      }, {
        eventName: 'keypress',
        eventHandler: _eventNormalize(formatCardNumber)
      }, {
        eventName: 'keydown',
        eventHandler: _eventNormalize(formatBackCardNumber)
      }, {
        eventName: 'paste',
        eventHandler: _eventNormalize(reFormatCardNumber)
      }, {
        eventName: 'change',
        eventHandler: _eventNormalize(reFormatCardNumber)
      }, {
        eventName: 'input',
        eventHandler: _eventNormalize(reFormatCardNumber)
      }
    ],
    numericInput: [
      {
        eventName: 'keypress',
        eventHandler: _eventNormalize(restrictNumeric)
      }, {
        eventName: 'paste',
        eventHandler: _eventNormalize(restrictNumeric)
      }, {
        eventName: 'change',
        eventHandler: _eventNormalize(restrictNumeric)
      }, {
        eventName: 'input',
        eventHandler: _eventNormalize(restrictNumeric)
      }
    ]
  };
  attachEvents = function(input, events, detach) {
    var evt, i, len;
    for (i = 0, len = events.length; i < len; i++) {
      evt = events[i];
      if (detach) {
        _off(input, evt.eventName, evt.eventHandler);
      } else {
        _on(input, evt.eventName, evt.eventHandler);
      }
    }
  };
  payform.cvcInput = function(input) {
    return attachEvents(input, eventList.cvcInput);
  };
  payform.expiryInput = function(input) {
    return attachEvents(input, eventList.expiryInput);
  };
  payform.cardNumberInput = function(input) {
    return attachEvents(input, eventList.cardNumberInput);
  };
  payform.numericInput = function(input) {
    return attachEvents(input, eventList.numericInput);
  };
  payform.detachCvcInput = function(input) {
    return attachEvents(input, eventList.cvcInput, true);
  };
  payform.detachExpiryInput = function(input) {
    return attachEvents(input, eventList.expiryInput, true);
  };
  payform.detachCardNumberInput = function(input) {
    return attachEvents(input, eventList.cardNumberInput, true);
  };
  payform.detachNumericInput = function(input) {
    return attachEvents(input, eventList.numericInput, true);
  };
  payform.parseCardExpiry = function(value) {
    var month, prefix, ref, year;
    value = value.replace(/\s/g, '');
    ref = value.split('/', 2), month = ref[0], year = ref[1];
    if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
      prefix = (new Date).getFullYear();
      prefix = prefix.toString().slice(0, 2);
      year = prefix + year;
    }
    month = parseInt(month.replace(/[\u200e]/g, ""), 10);
    year = parseInt(year, 10);
    return {
      month: month,
      year: year
    };
  };
  payform.validateCardNumber = function(num) {
    var card, ref;
    num = (num + '').replace(/\s+|-/g, '');
    if (!/^\d+$/.test(num)) {
      return false;
    }
    card = cardFromNumber(num);
    if (!card) {
      return false;
    }
    return (ref = num.length, indexOf.call(card.length, ref) >= 0) && (card.luhn === false || luhnCheck(num));
  };
  payform.validateCardExpiry = function(month, year) {
    var currentTime, expiry, ref;
    if (typeof month === 'object' && 'month' in month) {
      ref = month, month = ref.month, year = ref.year;
    }
    if (!(month && year)) {
      return false;
    }
    month = String(month).trim();
    year = String(year).trim();
    if (!/^\d+$/.test(month)) {
      return false;
    }
    if (!/^\d+$/.test(year)) {
      return false;
    }
    if (!((1 <= month && month <= 12))) {
      return false;
    }
    if (year.length === 2) {
      if (year < 70) {
        year = "20" + year;
      } else {
        year = "19" + year;
      }
    }
    if (year.length !== 4) {
      return false;
    }
    expiry = new Date(year, month);
    currentTime = new Date;
    expiry.setMonth(expiry.getMonth() - 1);
    expiry.setMonth(expiry.getMonth() + 1, 1);
    return expiry > currentTime;
  };
  payform.validateCardCVC = function(cvc, type) {
    var card, ref;
    cvc = String(cvc).trim();
    if (!/^\d+$/.test(cvc)) {
      return false;
    }
    card = cardFromType(type);
    if (card != null) {
      return ref = cvc.length, indexOf.call(card.cvcLength, ref) >= 0;
    } else {
      return cvc.length >= 3 && cvc.length <= 4;
    }
  };
  payform.parseCardType = function(num) {
    var ref;
    if (!num) {
      return null;
    }
    return ((ref = cardFromNumber(num)) != null ? ref.type : void 0) || null;
  };
  payform.formatCardNumber = function(num) {
    var card, groups, ref, upperLength;
    num = replaceFullWidthChars(num);
    num = num.replace(/\D/g, '');
    card = cardFromNumber(num);
    if (!card) {
      return num;
    }
    upperLength = card.length[card.length.length - 1];
    num = num.slice(0, upperLength);
    if (card.format.global) {
      return (ref = num.match(card.format)) != null ? ref.join(' ') : void 0;
    } else {
      groups = card.format.exec(num);
      if (groups == null) {
        return;
      }
      groups.shift();
      groups = groups.filter(Boolean);
      return groups.join(' ');
    }
  };
  payform.formatCardExpiry = function(expiry) {
    var mon, parts, sep, year;
    expiry = replaceFullWidthChars(expiry);
    parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);
    if (!parts) {
      return '';
    }
    mon = parts[1] || '';
    sep = parts[2] || '';
    year = parts[3] || '';
    if (year.length > 0) {
      sep = ' / ';
    } else if (sep === ' /') {
      mon = mon.substring(0, 1);
      sep = '';
    } else if (mon.length === 2 || sep.length > 0) {
      sep = ' / ';
    } else if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
      mon = "0" + mon;
      sep = ' / ';
    }
    return mon + sep + year;
  };
  return payform;
});


},{}]},{},[1]);
