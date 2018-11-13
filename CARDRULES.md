# Supported Card Types

The following list contains Issuer Identification Number (IIN) patterns and length for all debit and credit card types supported by Payform. Please note that while references are provided, there may be some missing matching patterns. Nevertheless, the current regular expressions used are valid with respect to these sources.

## Credit Cards

### American Express <img src="https://user-images.githubusercontent.com/6437556/45498241-a561a100-b747-11e8-995d-4a935e4c7b5c.png" width="30" height="20">

**IIN Pattern:** 34, 37 <sup>[1]</sup>

**Length:** 15 <sup>[2]</sup>

### Diners Club <img src="https://user-images.githubusercontent.com/6437556/45498174-8400b500-b747-11e8-9afd-85ea2441a9be.png" width="30" height="20">

**IIN Pattern:** 36, 38, 30[0-5] <sup>[3]</sup>

**Length:** 14 <sup>[3]</sup>

### Discover <img src="https://user-images.githubusercontent.com/6437556/45498205-94b12b00-b747-11e8-8749-938483df9cf4.png" width="30" height="20">

**IIN Pattern:** 6011, 65, 64[4-9], 622 <sup>[3]</sup>

**Length:** 16 <sup>[3]</sup>

### Hipercard

**IIN Pattern:** 384100, 384140, 384160, 606282, 637095, 637568, 60(?!11) <sup> [4], [5]</sup>

**Length:** 14-19 

### JCB <img src="https://user-images.githubusercontent.com/6437556/45514600-c2ac6480-b773-11e8-9565-b24839dfa816.png" width="30" height="20">

**IIN Pattern:** 35 <sup>[3]</sup>

**Length:** 16-19 <sup>[3]</sup>

### Mastercard <img src="https://user-images.githubusercontent.com/6437556/45498138-73503f00-b747-11e8-832d-aa23b5eab2a5.png" width="30" height="20">


**IIN Pattern:** 5[1-5], 677189 ,222[1-9], 2[3-6][0-9][0-9], 27[0-1][0-9], 2720 <sup>[1], [6]</sup>

**Length:** 16

### Unionpay

**IIN Pattern:** 62 <sup>[3]</sup>

**Length:** 16-19 <sup>[3]</sup>

### Visa <img src="https://user-images.githubusercontent.com/6437556/45498128-6c293100-b747-11e8-9d92-60c4cdca2436.png" width="30" height="20">

**IIN Pattern:** 4 <sup>[7]</sup>

**Length:** 13, 16, 19

## Debit Cards 

### Dankkort

**IIN Pattern:** 5019 <sup>[8]</sup>

**Length:** 16

### Elo

**IIN Pattern:** (4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|4(0[5-9]|3[0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8])|9([2-6][0-9]|7[0-8])|541|700|720|901)|651652|655000|655021) <sup>[9], [10]</sup>

**Length:** 16

### Forbrugsforeningen

**IIN Pattern:** 600 <sup>[11]</sup>

**Length:** 16

### Maestro <img src="https://user-images.githubusercontent.com/6437556/45498343-d17d2200-b747-11e8-8a17-7768071a0f2f.png" width="30" height="20">

**IIN Pattern:** 5018, 5020, 5038, 6304, 639000 to 639099, 670000 to 679999 <sup>[12], [13]</sup>

**Length:** 12-19

### Visa Electron <img src="https://user-images.githubusercontent.com/6437556/45514634-dfe13300-b773-11e8-8b1b-52b2bfc30438.png" width="30" height="20">

**IIN Pattern:** 4026, 417500, 4405, 4508, 4844, 4913, 4917 <sup>[7]</sup>

**Length:** 16

<!-- References -->

[1]: https://www.moneris.com/-/media/Moneris/Files/EN/Support/Compliance-Information/CAG_booklet.pdf
[2]: https://www.cybersource.com/developers/getting_started/test_and_manage/best_practices/card_type_id/
[3]: https://www.discovernetwork.com/downloads/IPP_VAR_Compliance.pdf
[4]: https://mage2.pro/t/topic/3865
[5]: https://stevemorse.org/ssn/List_of_Bank_Identification_Numbers.html
[6]: https://www.mastercard.us/en-us/issuers/get-support/2-series-bin-expansion.html
[7]: https://baymard.com/checkout-usability/credit-card-patterns
[8]: https://www.nets.eu/dk-da/kundeservice/Verifikation%20af%20betalingsl%C3%B8sninger/Documents/ct-trg-otrs-en.pdf
[9]: https://mage2.pro/t/topic/3867
[10]: https://github.com/Adyen/adyen-magento/issues/236
[11]: https://tech.dibspayment.com/D2/Toolbox/Test_information/Cards
[12]: http://blog.unibulmerchantservices.com/12-signs-of-a-valid-mastercard-card/
[13]: https://www.mastercard.us/content/dam/mccom/global/documents/mastercard-rules.pdf
