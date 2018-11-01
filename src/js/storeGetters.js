import convertCurrency from './modules/convertCurrency';

const getters = {
  filter: state => {
    return state.filter;
  },

  isLoading: state => {
    return state.isLoading;
  },

  filter: state => {
    return state.filter;
  },

  filterItem: state => (itemName) => {
    let filter;
    state.filter.forEach((elm,index) => {
      if (elm.name === itemName) {
        filter = elm
      }
    });
    return filter;
  },
  
  allProducts: state => {
    return state.allProducts;
  },

  filteredProductsSteps: state => {
    return state.filteredProducts.productSteps;
  },
  
  filteredVisibleProducts: state => {
    return state.filteredProducts.visible;
  },

  allFilteredProducts: state => {
    return state.filteredProducts.products;
  },

  allAreVisible: state => {
    return state.filteredProducts.allAreVisible;
  },

  filterSelectedStatus: state => {
    return state.filteredProducts.selected;
  },
  
  filteredProducts: (state, getters) => { 
    const allProducts = getters.allProducts;
    const allFilteredProducts = getters.allFilteredProducts;
    const visibleProducts = getters.filteredVisibleProducts;
    const filterSelected = getters.filterSelectedStatus;
    const activeCurrency = getters.activeCurrency;
    const standardCurrency = getters.standardCurrency;
    const allCurrencies = getters.allCurrencies;

    let filteredProducts = [];
    let productCounter = 0;

    if (allProducts.length === 0) { return filteredProducts; }

    const convertCurrencyIfChanged = (elm) => {
      if (activeCurrency !== standardCurrency) {
        elm = JSON.parse(JSON.stringify(elm));
        elm.variants[0].price = convertCurrency(allCurrencies, elm.variants[0].price, standardCurrency, activeCurrency, true);
        elm.variants[0].compare_at_price = convertCurrency(allCurrencies, elm.variants[0].compare_at_price, standardCurrency, activeCurrency, true);
      }
      return elm;
    };

    if (filterSelected && allFilteredProducts.length === 0) {
      // If filter has no results
      filteredProducts = [];
    } else {

      // Collect filtered indexed products
      if (allFilteredProducts.length > 0) {
  
        allFilteredProducts.forEach((elm,index) => {
          productCounter++;
          if (productCounter <= visibleProducts) { 
            elm = convertCurrencyIfChanged(elm);
            filteredProducts.push(elm);
          }
        });
      } else {
                  
        allProducts.forEach((elm,index) => {
          if (index < visibleProducts) {
            elm = convertCurrencyIfChanged(elm);
            filteredProducts.push(elm);
          }
        });

      }

    }
    
    return filteredProducts;
    
  },

  allCurrencies: state => {
    return state.currencies;
  },

  activeCurrency: state => {
    return state.activeCurrency;
  },

  standardCurrency: state => {
    return state.standardCurrency;
  },

  sortByMethod: state => {
    return state.sortBy;
  },
  
  ifSorted: state => {
    return state.sorted;
  },
};

export {
  getters
}
