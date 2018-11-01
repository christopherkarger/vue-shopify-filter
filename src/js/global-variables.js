const scriptSrc = document.currentScript.src;

export default (dom) => {
  //document.querySelector('html').setAttribute('lang', 'en');

  let filterWrapper,
      filterApp,
      productItems,
      productsPages;

  if (dom) {
    filterWrapper = document.getElementById('filter-wrapper');
    filterApp = document.getElementById('filter-app');
    productItems = (filterWrapper) ? filterWrapper.getAttribute('data-items') : false;
    productsPages = (productItems) ? Math.ceil(productItems / 250) : false;
  }
  
  return global = {
    tax: 1.19,
    productSteps: 24,
    standardCurrency: 'EUR',
    currencyCookieName: ['_g1518790101', '_g1519237503', '_g1519238031'],
    currencyUrl: 'https://init.grizzlyapps.com/9e32c84f0db4f7b1eb40c32bdb0bdea9',
    language: document.querySelector('html').getAttribute('lang') || 'en',
    filterApp,
    filterSrc : scriptSrc.replace('js','json'),
    productsPages
  }

}


