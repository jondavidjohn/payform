
/*
  Payform Javascript Library

  URL: https://github.com/jondavidjohn/payform
  Author: Jonathan D. Johnson <me@jondavidjohn.com>
  License: MIT
  Version: 1.0.0
 */

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function(name, definition) {
    if (typeof module !== "undefined" && module !== null) {
      return module.exports = definition();
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
      return define(definition);
    } else {
      return this[name] = definition();
    }
  })('payform', function() {
    var cardFromNumber, cardFromType, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardExpiry, formatCardNumber, formatForwardExpiry, formatForwardSlashAndSpace, hasTextSelected, luhnCheck, payform, reFormatCVC, reFormatCardNumber, reFormatExpiry, reFormatNumeric, restrictCVC, restrictCardNumber, restrictExpiry, restrictNumeric;
    payform = {};
    defaultFormat = /(\d{1,4})/g;
    payform.cards = [
      {
        type: 'visaelectron',
        pattern: /^4(026|17500|405|508|844|91[37])/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
      }, {
        type: 'maestro',
        pattern: /^(5(018|0[23]|[68])|6(39|7))/,
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
        length: [13, 16],
        cvcLength: [3],
        luhn: true
      }, {
        type: 'mastercard',
        pattern: /^5[0-5]/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
      }, {
        type: 'amex',
        pattern: /^3[47]/,
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        length: [15],
        cvcLength: [3, 4],
        luhn: true
      }, {
        type: 'dinersclub',
        pattern: /^3[0689]/,
        format: defaultFormat,
        length: [14],
        cvcLength: [3],
        luhn: true
      }, {
        type: 'discover',
        pattern: /^6([045]|22)/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
      }, {
        type: 'unionpay',
        pattern: /^(62|88)/,
        format: defaultFormat,
        length: [16, 17, 18, 19],
        cvcLength: [3],
        luhn: false
      }, {
        type: 'jcb',
        pattern: /^35/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
      }
    ];
    cardFromNumber = function(num) {
      var card, _i, _len, _ref;
      num = (num + '').replace(/\D/g, '');
      _ref = payform.cards;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        card = _ref[_i];
        if (card.pattern.test(num)) {
          return card;
        }
      }
    };
    cardFromType = function(type) {
      var card, _i, _len, _ref;
      _ref = payform.cards;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        card = _ref[_i];
        if (card.type === type) {
          return card;
        }
      }
    };
    luhnCheck = function(num) {
      var digit, digits, odd, sum, _i, _len;
      odd = true;
      sum = 0;
      digits = (num + '').split('').reverse();
      for (_i = 0, _len = digits.length; _i < _len; _i++) {
        digit = digits[_i];
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
      var _ref;
      if ((typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? _ref.createRange : void 0 : void 0) != null) {
        if (document.selection.createRange().text) {
          return true;
        }
      }
      return target.selectionStart && target.selectionStart !== target.selectionEnd;
    };
    reFormatNumeric = function(e) {
      var target;
      target = e.target || e.srcElement;
      return target.value = target.value.replace(/\D/g, '');
    };
    reFormatCardNumber = function(e) {
      var cursor, target;
      target = e.target || e.srcElement;
      cursor = target.selectionStart;
      target.value = payform.formatCardNumber(target.value);
      if (cursor != null) {
        return target.setSelectionRange(cursor, cursor);
      }
    };
    formatCardNumber = function(e) {
      var card, digit, length, re, target, upperLength, value;
      digit = String.fromCharCode(e.which);
      if (!/^\d+$/.test(digit)) {
        return;
      }
      target = e.target || e.srcElement;
      value = target.value;
      card = cardFromNumber(value + digit);
      length = (value.replace(/\D/g, '') + digit).length;
      upperLength = 16;
      if (card) {
        upperLength = card.length[card.length.length - 1];
      }
      if (length >= upperLength) {
        return;
      }
      if ((target.selectionStart != null) && target.selectionStart !== value.length) {
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
          return target.value = value + " " + digit;
        });
      } else if (re.test(value + digit)) {
        e.preventDefault();
        return setTimeout(function() {
          return target.value = (value + digit) + " ";
        });
      }
    };
    formatBackCardNumber = function(e) {
      var target, value;
      target = e.target || e.srcElement;
      value = target.value;
      if (e.which !== 8) {
        return;
      }
      if ((target.selectionStart != null) && target.selectionStart !== value.length) {
        return;
      }
      if (/\d\s$/.test(value)) {
        e.preventDefault();
        return setTimeout(function() {
          return target.value = value.replace(/\d\s$/, '');
        });
      } else if (/\s\d?$/.test(value)) {
        e.preventDefault();
        return setTimeout(function() {
          return target.value = value.replace(/\d$/, '');
        });
      }
    };
    reFormatExpiry = function(e) {
      var cursor, target;
      target = e.target || e.srcElement;
      cursor = target.selectionStart;
      target.value = payform.formatCardExpiry(target.value);
      if (cursor != null) {
        return target.setSelectionRange(cursor, cursor);
      }
    };
    formatCardExpiry = function(e) {
      var digit, target, val;
      digit = String.fromCharCode(e.which);
      if (!/^\d+$/.test(digit)) {
        return;
      }
      target = e.target || e.srcElement;
      val = target.value + digit;
      if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
        e.preventDefault();
        return setTimeout(function() {
          return target.value = "0" + val + " / ";
        });
      } else if (/^\d\d$/.test(val)) {
        e.preventDefault();
        return setTimeout(function() {
          return target.value = val + " / ";
        });
      }
    };
    formatForwardExpiry = function(e) {
      var digit, target, val;
      digit = String.fromCharCode(e.which);
      if (!/^\d+$/.test(digit)) {
        return;
      }
      target = e.target || e.srcElement;
      val = target.value;
      if (/^\d\d$/.test(val)) {
        return target.value = val + " / ";
      }
    };
    formatForwardSlashAndSpace = function(e) {
      var target, val, which;
      which = String.fromCharCode(e.which);
      if (!(which === '/' || which === ' ')) {
        return;
      }
      target = e.target || e.srcElement;
      val = target.value;
      if (/^\d$/.test(val) && val !== '0') {
        return target.value = "0" + val + " / ";
      }
    };
    formatBackExpiry = function(e) {
      var target, value;
      target = e.target || e.srcElement;
      value = target.value;
      if (e.which !== 8) {
        return;
      }
      if ((target.selectionStart != null) && target.selectionStart !== value.length) {
        return;
      }
      if (/\d\s\/\s$/.test(value)) {
        e.preventDefault();
        return setTimeout(function() {
          return target.value = value.replace(/\d\s\/\s$/, '');
        });
      }
    };
    reFormatCVC = function(e) {
      return setTimeout(function() {
        var cursor, target;
        target = e.target || e.srcElement;
        cursor = target.selectionStart;
        target.value = target.value.replace(/\D/g, '').slice(0, 4);
        if (cursor != null) {
          return target.setSelectionRange(cursor, cursor);
        }
      });
    };
    restrictNumeric = function(e) {
      var input;
      if (e.metaKey || e.ctrlKey) {
        return;
      }
      if (e.which === 0) {
        return;
      }
      if (e.which < 33) {
        return;
      }
      input = String.fromCharCode(e.which);
      if (!/^\d+$/.test(input)) {
        return e.preventDefault();
      }
    };
    restrictCardNumber = function(e) {
      var card, digit, target, value;
      target = e.target || e.srcElement;
      digit = String.fromCharCode(e.which);
      if (!/^\d+$/.test(digit)) {
        return;
      }
      if (hasTextSelected(target)) {
        return;
      }
      value = (target.value + digit).replace(/\D/g, '');
      card = cardFromNumber(value);
      if (card && value.length > card.length[card.length.length - 1]) {
        return e.preventDefault();
      } else if (value.length > 16) {
        return e.preventDefault();
      }
    };
    restrictExpiry = function(e) {
      var digit, target, value;
      target = e.target || e.srcElement;
      digit = String.fromCharCode(e.which);
      if (!/^\d+$/.test(digit)) {
        return;
      }
      if (hasTextSelected(target)) {
        return;
      }
      value = target.value + digit;
      value = value.replace(/\D/g, '');
      if (value.length > 6) {
        return e.preventDefault();
      }
    };
    restrictCVC = function(e) {
      var digit, target, val;
      target = e.target || e.srcElement;
      digit = String.fromCharCode(e.which);
      if (hasTextSelected(target)) {
        return;
      }
      val = target.value + digit;
      if (val.length > 4) {
        return e.preventDefault();
      }
    };
    payform.cvcInput = function(input) {
      input.addEventListener('keypress', restrictNumeric);
      input.addEventListener('keypress', restrictCVC);
      input.addEventListener('paste', reFormatCVC);
      input.addEventListener('change', reFormatCVC);
      return input.addEventListener('input', reFormatCVC);
    };
    payform.expiryInput = function(input) {
      input.addEventListener('keypress', restrictNumeric);
      input.addEventListener('keypress', restrictExpiry);
      input.addEventListener('keypress', formatCardExpiry);
      input.addEventListener('keypress', formatForwardSlashAndSpace);
      input.addEventListener('keypress', formatForwardExpiry);
      input.addEventListener('keydown', formatBackExpiry);
      input.addEventListener('change', reFormatExpiry);
      return input.addEventListener('input', reFormatExpiry);
    };
    payform.cardNumberInput = function(input) {
      input.addEventListener('keypress', restrictNumeric);
      input.addEventListener('keypress', restrictCardNumber);
      input.addEventListener('keypress', formatCardNumber);
      input.addEventListener('keydown', formatBackCardNumber);
      input.addEventListener('paste', reFormatCardNumber);
      input.addEventListener('change', reFormatCardNumber);
      return input.addEventListener('input', reFormatCardNumber);
    };
    payform.parseCardExpiry = function(value) {
      var month, prefix, year, _ref;
      value = value.replace(/\s/g, '');
      _ref = value.split('/', 2), month = _ref[0], year = _ref[1];
      if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
        prefix = (new Date).getFullYear();
        prefix = prefix.toString().slice(0, 2);
        year = prefix + year;
      }
      month = parseInt(month, 10);
      year = parseInt(year, 10);
      return {
        month: month,
        year: year
      };
    };
    payform.validateCardNumber = function(num) {
      var card, _ref;
      num = (num + '').replace(/\s+|-/g, '');
      if (!/^\d+$/.test(num)) {
        return false;
      }
      card = cardFromNumber(num);
      if (!card) {
        return false;
      }
      return (_ref = num.length, __indexOf.call(card.length, _ref) >= 0) && (card.luhn === false || luhnCheck(num));
    };
    payform.validateCardExpiry = function(month, year) {
      var currentTime, expiry, _ref;
      if (typeof month === 'object' && 'month' in month) {
        _ref = month, month = _ref.month, year = _ref.year;
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
      var card, _ref;
      cvc = String(cvc).trim();
      if (!/^\d+$/.test(cvc)) {
        return false;
      }
      card = cardFromType(type);
      if (card != null) {
        return _ref = cvc.length, __indexOf.call(card.cvcLength, _ref) >= 0;
      } else {
        return cvc.length >= 3 && cvc.length <= 4;
      }
    };
    payform.parseCardType = function(num) {
      var _ref;
      if (!num) {
        return null;
      }
      return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
    };
    payform.formatCardNumber = function(num) {
      var card, groups, upperLength, _ref;
      num = num.replace(/\D/g, '');
      card = cardFromNumber(num);
      if (!card) {
        return num;
      }
      upperLength = card.length[card.length.length - 1];
      num = num.slice(0, upperLength);
      if (card.format.global) {
        return (_ref = num.match(card.format)) != null ? _ref.join(' ') : void 0;
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
      parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);
      if (!parts) {
        return '';
      }
      mon = parts[1] || '';
      sep = parts[2] || '';
      year = parts[3] || '';
      if (year.length > 0 || (sep.length > 0 && !(/\ \/?\ ?/.test(sep)))) {
        sep = ' / ';
      }
      if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
        mon = "0" + mon;
        sep = ' / ';
      }
      return mon + sep + year;
    };
    return payform;
  });

}).call(this);
