# payform

[![Build Status](https://travis-ci.org/jondavidjohn/payform.svg?branch=master)](https://travis-ci.org/jondavidjohn/payform)
![Dependencies](https://david-dm.org/jondavidjohn/payform.svg)

[![NPM](https://nodei.co/npm/payform.png)](https://npmjs.org/package/payform)

A general purpose library for building credit card forms, validating inputs, and formatting numbers.

Available via **NPM** (Node or Browserify) and **Bower**.  Supports IE8+.

For example, you can make a input act like a credit card field (with number formatting and length restriction):

``` javascript
var input = document.getElementById('ccnum');
payform.cardNumberInput(input);
```

Then, when the payment form is submitted, you can validate the card number on the client-side (or server-side):

``` javascript
var valid = payform.validateCardNumber(input.value);

if (!valid) {
  alert('Your card is not valid!');
  return false;
}
```

You can find a [demo here](http://jondavidjohn.github.io/payform).

Supported card types are:

* Visa
* MasterCard
* American Express
* Diners Club
* Discover
* UnionPay
* JCB
* Visa Electron
* Maestro
* Forbrugsforeningen
* Dankort

(Additional card types are supported by extending the [`payform.cards`](#payformcards) array.)

## API

### payform.validateCardNumber(number)

Validates a card number:

* Validates numbers
* Validates Luhn algorithm
* Validates length

Example:

``` javascript
payform.validateCardNumber('4242 4242 4242 4242'); //=> true
```

### payform.validateCardExpiry(month, year)

Validates a card expiry:

* Validates numbers
* Validates in the future
* Supports year shorthand

Example:

``` javascript
payform.validateCardExpiry('05', '20'); //=> true
payform.validateCardExpiry('05', '2015'); //=> true
payform.validateCardExpiry('05', '05'); //=> false
```

### payform.validateCardCVC(cvc, type)

Validates a card CVC:

* Validates number
* Validates length to 4

Example:

``` javascript
payform.validateCardCVC('123'); //=> true
payform.validateCardCVC('123', 'amex'); //=> true
payform.validateCardCVC('1234', 'amex'); //=> true
payform.validateCardCVC('12344'); //=> false
```

### payform.parseCardType(number)

Returns a card type. Either:

* `visa`
* `mastercard`
* `amex`
* `dinersclub`
* `discover`
* `unionpay`
* `jcb`
* `visaelectron`
* `maestro`
* `forbrugsforeningen`
* `dankort`

The function will return `null` if the card type can't be determined.

Example:

``` javascript
payform.parseCardType('4242 4242 4242 4242'); //=> 'visa'
```

### payform.parseCardExpiry(string)

Parses a credit card expiry in the form of MM/YYYY, returning an object containing the `month` and `year`. Shorthand years, such as `13` are also supported (and converted into the longhand, e.g. `2013`).

``` javascript
payform.parseCardExpiry('03 / 2025'); //=> {month: 3: year: 2025}
payform.parseCardExpiry('05 / 04'); //=> {month: 5, year: 2004}
```

This function doesn't perform any validation of the month or year; use `payform.validateCardExpiry(month, year)` for that.

### payform.cards

Array of objects that describe valid card types. Each object should contain the following fields:

``` javascript
{
  // Card type, as returned by payform.parseCardType.
  type: 'mastercard',
  // Regex used to identify the card type. For the best experience, this should be
  // the shortest pattern that can guarantee the card is of a particular type.
  pattern: /^5[0-5]/,
  // Array of valid card number lengths.
  length: [16],
  // Array of valid card CVC lengths.
  cvcLength: [3],
  // Boolean indicating whether a valid card number should satisfy the Luhn check.
  luhn: true,
  // Regex used to format the card number. Each match is joined with a space.
  format: /(\d{1,4})/g
}
```

When identifying a card type, the array is traversed in order until the card number matches a `pattern`. For this reason, patterns with higher specificity should appear towards the beginning of the array.

## Browser `<input>` Helpers

These methods are specifically for use in the browser to attach `<input>` formatters.

### payform.cardNumberInput(input)

Formats card numbers:

* Includes a space between every 4 digits
* Restricts input to numbers
* Limits to 16 numbers
* Supports American Express formatting

Example:

``` javascript
var input = document.getElementById('ccnum');
payform.cardNumberInput(input);
```

### payform.expiryInput(input)

Formats card expiry:

* Includes a `/` between the month and year
* Restricts input to numbers
* Restricts length

Example:

``` javascript
var input = document.getElementById('ccnum');
payform.expiryInput(input);
```

### payform.cvcInput(input)

Formats card CVC:

* Restricts length to 4 numbers
* Restricts input to numbers

Example:

``` javascript
var input = document.getElementById('ccnum');
payform.cvcInput(input);
```

## Building

Run `npm run build`

## Running tests

Run `npm test`

## Autocomplete recommendations

We recommend you turn autocomplete on for credit card forms, except for the CVC field (which should never be stored). You can do this by setting the `autocomplete` attribute:

``` html
<form autocomplete="on">
  <input class="cc-number">
  <input class="cc-cvc" autocomplete="off">
</form>
```

You should also mark up your fields using the [Autofill spec](https://html.spec.whatwg.org/multipage/forms.html#autofill). These are respected by a number of browsers, including Chrome.

``` html
<input type="tel" class="cc-number" autocomplete="cc-number">
```

Set `autocomplete` to `cc-number` for credit card numbers and `cc-exp` for credit card expiry.

## Mobile recommendations

We recommend you to use `<input type="tel">` which will cause the numeric keyboard to be displayed on mobile devices:

``` html
<input type="tel" class="cc-number">
```

## A derived work

This library is derived from a lot of great work done on [`jquery.payment`](https://github.com/stripe/jquery.payment) by the folks at [Stripe](https://stripe.com/).  This aims to
build upon that work, in a module that can be consumed more easily with node/npm/browserify and without dependencies.
