import axios from 'axios';
import globals from './global-variables';
import sortArray from './modules/sortArray';
import getFilterByName from './modules/getFilterByName';

let errorCounter = 0;

const actions = {
  updateIsLoading: (context, loading) => {
    context.commit('updateIsLoading', loading);  
  },

  getJSON: (context) => {
    context.dispatch('updateIsLoading', true);
    const promises = [];
    let allProducts = [];
    let filterJSON = null;
    let currencies = {};
    let shopifyError = false;

    promises.push(
      axios.get(globals().currencyUrl)
      .then(result => {
        const currencyString = result.data;
        const regexExp = /(rates: )(.+)(convert.*)/;
        const currencyObj = regexExp.exec(currencyString);

        // If found
        if (currencyObj[2]) {
          let trimedObj = currencyObj[2].trim(); 
          if (trimedObj[trimedObj.length - 1] === ',') {
            trimedObj = trimedObj.slice(0, -1);
          }
          currencies = JSON.parse(trimedObj);
        }         
      })
    );

    promises.push( 
      axios.get(globals().filterSrc)
      .then(result => {
        filterJSON = result.data;
      })
      .catch(() => {
        shopifyError = true;
      })
    );

    const productsPages = globals(true).productsPages;
    if (productsPages) {
      
      // First page is on this page
      allProducts = allProducts.concat(JSON.parse(JSON.stringify(window.allProducts)));

      for (let i = 2; i <= productsPages; i++) {
        const url = `${location.href}?page=${i}`;
        promises.push( 
          axios.get(url).then(result => {
            const data = result.data;
            const startString = "var allProducts = '";
            const endString = "';//products-json_end";
            let pageProducts = data.substr(data.indexOf(startString) + startString.length);
            
            pageProducts = pageProducts.split(endString);
            const parsedProducts = JSON.parse(pageProducts[0]);

            allProducts = allProducts.concat(parsedProducts);

          })
          .catch(() => {
            shopifyError = true;
          })
        );
      }

      Promise.all(promises).then(values => {
        
        if (shopifyError && errorCounter <= 3) {
          errorCounter++ 
          context.dispatch('getJSON');
          return;
        }
  
        context.dispatch('updateCurrencies', currencies);
        context.commit('saveProductsJSON', allProducts);
        context.dispatch('updateSorting');
        context.dispatch('processJSON', filterJSON);
        context.dispatch('updateIsLoading', false);

        var oldList = document.getElementById('products-list-loading');
        if (oldList) { oldList.parentNode.removeChild(oldList); }

      });    
    }
  },

  processJSON: (context, filterJSON) => {
    const getters = context.getters;
    const filterValues = [];
    const allProducts = getters.allProducts;
    const allProductsLength = allProducts.length;
    const vendors = [];
    let lowestPrice = null;
    let highestPrice = null;
    const tagFilterObj = {};

    
    filterJSON.forEach((filterItem) => {
      context.commit('addFilter', {
        name: filterItem.name,
        value: [],
        cluster: filterItem.cluster || null,
        dropdownText: filterItem.dropdownText,
        translate: filterItem.translate || null
      });
      

      if (filterItem.name !== 'vendor' && filterItem.name !== 'price') {
        tagFilterObj[filterItem.name] = [];
      }
      
    });

    
    allProducts.forEach((product,index) => {

      // Special Filter Vendor
      const vendor = product.vendor.trim();
      if (vendors.indexOf(vendor) === -1) {
        vendors.push(vendor); 
      }
        
      // Special Filter - Price
      const productPrice = parseFloat(product.variants[0].price);
      if (index == 0) {
        lowestPrice = productPrice;
        highestPrice = productPrice;
      } else {
        if (productPrice < lowestPrice) { lowestPrice = productPrice; }
        if (productPrice > highestPrice) { highestPrice = productPrice; }
      }

      // If last product push into array
      if (index == (allProductsLength - 1)) {
        lowestPrice = Math.round(lowestPrice * 100) / 100;
        highestPrice = Math.round(highestPrice * 100) / 100;
        filterValues.push({
          name: 'price',
          value: [lowestPrice, highestPrice]
        });
        filterValues.push({ name: 'vendor', value: vendors });

      }

      if (product.hasOwnProperty('tags')) {
        
        product.tags.forEach((tagItem) => {
          
          filterJSON.forEach((filterItem) => {
            const filterName = filterItem.name;
            if (filterName !== 'vendor' && filterName !== 'price') {
              const cleanTagItem = tagItem.trim();
              if (filterItem.value.indexOf(cleanTagItem) > -1) {
                if (tagFilterObj[filterName].indexOf(cleanTagItem) == -1) { 
                  tagFilterObj[filterName].push(cleanTagItem);
                }
              }
            }
          });
        });
      }
    
    });


    for (let key in tagFilterObj) {
      filterValues.push({
        name: key,
        value: tagFilterObj[key]
      });
    }
    
    filterValues.forEach((elm) => {
      if (Array.isArray(elm.value) && elm.name !== 'price') {
        elm.value = sortArray(elm.value, getFilterByName(elm.name, filterJSON));
      }
      context.commit('addItemsToFilter', { name: elm.name, value: elm.value });
    });

    context.dispatch('updateVisibleNumber');
    //console.log(allProductVariants);
  },

  updateVisibleNumber: (context) => {
    const getters = context.getters;
    let allFilteredProductsLength = getters.allFilteredProducts.length;
    const productSteps = getters.filteredProductsSteps;
    const visible = getters.filteredVisibleProducts;
    let showMore = productSteps;
    
    if (allFilteredProductsLength == 0) {
      allFilteredProductsLength = getters.allProducts.length;
    } 

    if (visible == allFilteredProductsLength) {
      return;
    }

    if ((visible +  productSteps) > allFilteredProductsLength) {
      showMore = allFilteredProductsLength - visible;
      context.dispatch('updateAllAreVisible');
    }

    context.commit('updateVisibleNumber', showMore);

  },

  updateAllAreVisible: (context) => {
    context.commit('updateAllAreVisible');
  },

  updateFilteredProducts: (context, payload) => {
    const getters = context.getters;
    const allProducts = getters.allProducts;
    let filtered = false;
    
    let filteredProducts = [];
    const toFullFill = Object.keys(payload.selectedFilter).length;

    if (payload.atLeastOneFilterSelected) {

      allProducts.forEach((product,productIndex) => {
        const productPrice = parseFloat(product.variants[0].price);
        const compareAtPrice = parseFloat(product.variants[0].compare_at_price);

        let fullFilled = 0;
        for (let key in payload.selectedFilter) {
          const valueArray = payload.selectedFilter[key];
          let foundProduct = false;

          if (key == 'price' || key == 'sale') {
            if (key == 'price') {
                         
              let minPrice = parseFloat(valueArray[0]);
              let maxPrice = parseFloat(valueArray[1]);
  
              if (productPrice >= minPrice && productPrice <= maxPrice) {
                foundProduct = true;
              }
            }

            if (key == 'sale') {   
              if (compareAtPrice > 0 && compareAtPrice > productPrice) {
                foundProduct = true;
              }
            }

          } else if (key == 'onlyavailable') {   
            product.variants.forEach(element => {
              if (element.available) { 
                foundProduct = true;
              } 
            });
          } else {
            valueArray.forEach((elm) => {
              
              if (key === 'color' || key === 'size' ) {
                if (product.tags.indexOf(elm) > -1) { 
                  foundProduct = true;
                }
              }
             
              if (key === 'vendor' && product.vendor === elm) {
                foundProduct = true;
              }

            });
          }
 
          if (foundProduct) { 
            fullFilled++; 
          }
        }

        if (fullFilled === toFullFill) {
          filteredProducts.push(product);
        }
      
      });

      if (filteredProducts.length > 0) {
        filtered = true;
      }

    } 

    context.commit('updateFilteredProducts', filteredProducts);
    context.dispatch('updateSorting', { filtered });
    context.dispatch('resetVisibleNumber');
    context.dispatch('resetAllAreVisible');
    context.dispatch('updateVisibleNumber');
    context.dispatch('updateFilterSelectedStatus', payload.atLeastOneFilterSelected);
   
  },

  resetVisibleNumber: (context) => {
    context.commit('resetVisibleNumber');
  },

  resetAllAreVisible: (context) => {
    context.commit('resetAllAreVisible');
  },

  updateFilterSelectedStatus: (context, status) => {
    context.commit('updateFilterSelectedStatus', status);
  },

  updateCurrencies: (context, data) => {
    context.commit('updateCurrencies', data);
  },
  
  updateActiveCurrency: (context, data) => {
    context.commit('updateActiveCurrency', data);
  },

  sortProducts: (context, payload) => {
    const getters = context.getters;
    const allFilteredProducts = getters.allFilteredProducts;

    let products = (allFilteredProducts.length > 0) ?
                    allFilteredProducts : 
                    getters.allProducts;
    
    const filtered = (payload && payload.filtered) ? payload.filtered : false;
    
    products = sortArray(products, null, payload.method);
    context.commit('updateProducts', { products, filtered });
  },
  
  updateSorting: (context, payload) => {
    const method = (payload && payload.method) ? payload.method : context.getters.sortByMethod;
    const filtered = (payload && payload.filtered) ? payload.filtered : false;

    context.commit('updateSortByMethod', method);
    context.dispatch('sortProducts', { method, filtered });
    context.dispatch('updateIfSorted', true);
  },

  updateIfSorted: (context, status) => {
    context.commit('updateIfSorted', status);
  },

};

export {
  actions
}