import beautifyNumber from './modules/beautifyNumber';
import globals from './global-variables';

const mutations = {
  updateIsLoading: (state, loading) => {
    state.isLoading = loading;
  },

  saveProductsJSON: (state, products) => {
    
    const addCountryTax = (price) => {
      let newPrice = parseFloat(price) * globals().tax;
      newPrice = Math.round(newPrice * 100) / 100;
      return newPrice;
    };

    const replaceQuote = (str) => {
      return str.replace('**quote**', "'");
    };

    products.forEach((product,index)=> {
      const images = [];
      const variants = [];

      // let atLeastOneVariantAvailable = false;
      // product.variants.forEach((elm) => {
      //   if (elm.available) {
      //     atLeastOneVariantAvailable = true;
      //   }
      // });

      // if (atLeastOneVariantAvailable) {

        // Add images
        product.images.forEach((elm,index)=> {
          images.push({src: elm.src})
        });

        // Add variants
        product.variants.forEach((elm,index)=> {
          const price = (elm.taxable) ? addCountryTax(elm.price) : elm.price;
          const compPrice = (elm.taxable) ? addCountryTax(elm.compare_at_price) : elm.compare_at_price;
          variants.push({
            title: replaceQuote(elm.title),
            available: elm.available,
            price: beautifyNumber(price),
            compare_at_price: beautifyNumber(compPrice)
          })
        });
        
        // Add product to store
        state.allProducts.push({
          published_at: product.published_at,
          handle: product.handle,
          title: replaceQuote(product.title),
          vendor: replaceQuote(product.vendor),
          images,
          tags: product.tags,
          variants,
          index: product.index
        });
     // }
    });

  },

  addSortedProducts(state, products) {
    state.sortedProducts = products;
  },
  
  addFilter: (state, data) => {
    state.filter.push(data);
  },
  
  addItemsToFilter: (state, payload) => {
    state.filter.forEach((elm, index) => {
      if (elm.name == payload.name) {
        state.filter[index].value = payload.value;
      }
    });
  },
  
  updateVisibleNumber: (state, productSteps) => {
    state.filteredProducts.visible += productSteps;
  },

  resetVisibleNumber: (state) => {
    state.filteredProducts.visible = 0;
  },

  resetAllAreVisible: (state) => {
    state.filteredProducts.allAreVisible = false;
  },

  updateAllAreVisible: (state) => {
    state.filteredProducts.allAreVisible = true;
  },

  updateFilteredProducts: (state, products) => {
    state.filteredProducts.products = products;
  },

  updateCurrencies: (state, data) => {
    state.currencies = data;
  },

  updateActiveCurrency: (state, currency) => {
    state.activeCurrency = currency;
  },

  updateFilterSelectedStatus: (state, status) => {
    state.filteredProducts.selected = status;
  },

  updateIfSorted: (state, status) => {
    state.sorted = status;
  },

  updateSortByMethod: (state, method) => {
    state.sortBy = method;
  },

  updateProducts: (state, payload) => {
  
    if (payload.filtered) {
      state.filteredProducts.products = payload.products;
    } else {
      state.allProducts = payload.products;
    }
  }

};

export {
  mutations
}
