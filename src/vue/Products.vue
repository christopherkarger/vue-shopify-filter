<template>
  <div>
    <div class="product-list">
      <div class="product" v-for="(product, index) in products" :key="index">
      
        <a class="product-link" :href="getUrl(product.handle)">
          <div class="product-image-wrapper">
            <div class="mainproduct-img" v-if="product.images[0]">
              <img :src="product.images[0].src" />
            </div>
            <div class="alternative-img" v-if="product.images[1]">
              <img :src="product.images[1].src" />
            </div>
            <div class="sale-label" v-if="salePercentage(product) > 0">
              SALE -{{ salePercentage(product) }}%
            </div>
          </div>
          <div class="bottom-info">
            <div class="title">{{ product.title }}</div>
            
            <div class="price-wrapper" :class="{onsale: salePercentage(product) > 0}">
              <div class="price" v-html="formatCurrency(product.variants[0].price)"></div>
              <del v-if="parseFloat(product.variants[0].compare_at_price) > 0 && salePercentage(product) > 0" v-html="formatCurrency(product.variants[0].compare_at_price)"></del>
            </div>

          </div> 
        </a>
      </div>
    </div>
  
    <div class="no-products" v-if="products.length == 0 && !isLoading">
      <p v-if="language == 'de'">Keine Produkte gefunden</p>
      <p v-if="language == 'en'">No products found</p>
    </div>
  </div>
</template>
<script>
  import globals from '../js/global-variables';
  import { checkIfBottomInViewport } from '../js/modules/elementInViewport';
  import beautifyCurrency from '../js/modules/beautifyCurrency';

  export default {
    data() {
      return {
        language: globals().language
      }
    },
    methods: {
    
      addProducts() {
        this.$store.dispatch('updateVisibleNumber');
      },

      getUrl(handle) {
        return location.protocol + '//' + location.hostname + '/products/' + handle;
      },

      formatCurrency(amount) {
        const activeCurrency = this.$store.getters.activeCurrency;
        return beautifyCurrency(amount, activeCurrency);
      },

      salePercentage(product) {
        let percentage = 0;
        const price = parseFloat(product.variants[0].price);
        const comparePrice = parseFloat(product.variants[0].compare_at_price);

        if (comparePrice > 0) {
          if (comparePrice > price) {
            percentage =  100 - ((price / comparePrice) * 100);
            percentage = Math.round(percentage);
          }
        }

        return percentage;
      }
    },
 
    computed: {
      products() {
        return this.$store.getters.filteredProducts;
      },  
      allAreVisible() {
        return this.$store.getters.allAreVisible;
      },
      isLoading() {
        return this.$store.getters.isLoading;
      }
    },

    created() {
      let timeout;
      const elm = document.querySelector('#content');
      
      document.addEventListener('scroll', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const bottomInViewport = checkIfBottomInViewport(elm);
          if (bottomInViewport) {
            if (this.products.length > 0 && !this.allAreVisible) {
              this.addProducts();
            }    
          }
        }, 50);
      });
    }

  }
</script>
<style lang="scss" scoped>
  @import '../scss/products.scss';
</style>