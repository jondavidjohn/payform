var ccnum  = document.getElementById('ccnum'),
    type   = document.getElementById('ccnum-type'),
    expiry = document.getElementById('expiry'),
    cvc    = document.getElementById('cvc'),
    submit = document.getElementById('submit'),
    comp   = document.getElementById('complete');

payform.cardNumberInput(ccnum);
payform.expiryInput(expiry);
payform.cvcInput(cvc);

submit.addEventListener('click', function() {
  var valid  = true,
      expiryVal;

  if (!payform.validateCardNumber(ccnum.value)) {
    valid = false;
    type.value = '';
    addClass(ccnum.parentNode, 'error');
  } else {
    type.innerHTML = payform.parseCardType(ccnum.value);
    removeClass(ccnum.parentNode, 'error');
  }

  expiryVal = payform.parseCardExpiry(expiry.value);
  if (!payform.validateCardExpiry(expiryVal.month, expiryVal.year)) {
    valid = false;
    addClass(expiry.parentNode, 'error');
  } else {
    removeClass(expiry.parentNode, 'error');
  }

  if (!payform.validateCardCVC(cvc.value, type.innerHTML)) {
    valid = false;
    addClass(cvc.parentNode, 'error');
  } else {
    removeClass(cvc.parentNode, 'error');
  }

  if (valid) {
    comp.innerHTML = ' Yay!';
  } else {
    comp.innerHTML = ' :((((';
  }
});

function addClass(ele, _class) {
  if (ele.className.indexOf(_class) === -1) {
    ele.className += ' ' + _class;
  }
}

function removeClass(ele, _class) {
  if (ele.className.indexOf(_class) !== -1) {
    ele.className = ele.className.replace(_class, '');
  }
}
