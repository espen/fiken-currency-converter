/*

Made by Espen Antonsen (http://inspired.no)

Icon by Musket (https://thenounproject.com/search/?q=currency%20conversion&i=453082)

*/

window.addEventListener('load', function() {
  fikenCurrencyCreateButton();
});

function fikenCurrencyCreateButton() {
  var fikenCurrencyButton = document.createElement('div');
  fikenCurrencyButton.style.position = 'fixed';
  fikenCurrencyButton.style.top = '8px';
  fikenCurrencyButton.style.right = '20px';
  fikenCurrencyButton.style.color = 'green';
  fikenCurrencyButton.style.cursor = 'pointer';
  fikenCurrencyButton.style.zIndex = '9999991337';
  var image = document.createElement('img');
  image.src = safari.extension.baseURI + 'Icon-32-32.png';
  fikenCurrencyButton.appendChild( image );
  fikenCurrencyButton.addEventListener('click', fikenCurrencyConvert)
  document.body.appendChild(fikenCurrencyButton);
}

function fikenCurrencyGetInvoiceDate() {
  var invoiceDate = document.querySelector('fk-datepicker[ng-model="huc.handel.dato"] input, fk-datepicker[ng-model="mc.enkelHandel.dato"] input').value.split('.');
  if (invoiceDate.length == 3) {
    return invoiceDate.reverse().join('-');
  } else {
    return (new Date().getFullYear().toString()) + '-';
  }
}

function fikenCurrencyConvert() {
  var purchaseDate = prompt("Hvilken dato var kjøpet? (Format: YYYY-MM-DD)", fikenCurrencyGetInvoiceDate() );
  if (purchaseDate == null) { return;}
  var currencyCode = prompt("Hvilken valuta (Eks: USD, EUR)", "USD");
  if (currencyCode == null) { return;}
  var originalAmount = prompt("Beløp i " + currencyCode);
  if (originalAmount == null) { return;}
  fikenCurrencyGetRate(purchaseDate, currencyCode).then( function(currencyRate) {
    fikenCurrencySetConvertedAmount( parseFloat(originalAmount.replace(',', '.') ) * currencyRate );
  } );
}

function fikenCurrencyGetRate(purchaseDate, currencyCode) {
  return fetch('https://api.fixer.io/' + purchaseDate + '?base=' + currencyCode).then(
    function(response) {
      return response.text();
    }
  ).then(
    function(text) {
      return JSON.parse(text)['rates']['NOK'];
    }
  );
}

function fikenCurrencySetConvertedAmount(convertedAmount) {
  var amountEl = document.querySelector('fk-ny-belop[ng-model="linje.brutto"] input');
  amountEl.value = convertedAmount.toFixed(2).replace('.',',');
  amountEl.dispatchEvent( new Event("change", { bubbles: true }) );
  amountEl.dispatchEvent( new Event("blur", { bubbles: true }) );
}