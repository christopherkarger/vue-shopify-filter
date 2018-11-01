<template>
  <div class="price-slider">
    <vue-slider ref="priceslider" v-model="value" v-bind="options" @callback="change"></vue-slider>
    <div class="slider-info">
      <div class="min" v-html="formatCurrency(currentValMin)"></div>
      <div class="seperator">-</div>
      <div class="max" v-html="formatCurrency(currentValMax)"></div>
        
    </div>
  </div>
</template>
<script>
  import vueSlider from 'vue-slider-component';
  import convertCurrency from '../js/modules/convertCurrency';
  import beautifyCurrency from '../js/modules/beautifyCurrency';

  let timeout;
  let priceMulti = 1;

  export default {
    data () {
      const color = '#cd3f3f';
      return {
        currentValMin: null,
        currentValMax: null,
        value:[this.minPrice, this.maxPrice],
        options: {
          dotWidth: 20,
          dotHeight: 20,
          min: this.minPrice,
          max: this.maxPrice,
          tooltip: false,
          tooltipStyle: {
            backgroundColor: color,
            borderColor: color
          },
          processStyle: {
            backgroundColor: color
          }
        }
      }
    },
    props: ['minPrice', 'maxPrice', 'resetPriceSlider'],
  
    methods: {
      getCurrentValues() {
        const slider = this.$refs['priceslider'];
        const values = slider.getValue();
        return values;
      },
      
      formatCurrency(amount) {
        const activeCurrency = this.$store.getters.activeCurrency;
        return beautifyCurrency(amount, activeCurrency);
      },

      changePriceItem() {
        let values = this.getCurrentValues();
        
        if (!values || values == 0) {
          values = [this.minPrice, this.maxPrice];
        }

        this.currentValMin = Math.floor(values[0] * priceMulti);
        this.currentValMax = Math.ceil(values[1] * priceMulti);
      },
      
      change() {
        this.changePriceItem();

        clearTimeout(timeout);
        timeout = setTimeout(()=> {   
          const values = this.getCurrentValues();
          this.$emit('pricechange', values);
        }, 50);
      },

      changePriceMulti() {
        const standardCurrency = this.$store.getters.standardCurrency;
        const activeCurrency = this.$store.getters.activeCurrency;
        const allCurrencies = this.$store.getters.allCurrencies;
        
        if (activeCurrency !== standardCurrency) {
          priceMulti = parseFloat(convertCurrency(allCurrencies, 1, standardCurrency, activeCurrency));
        } else {
          priceMulti = 1;
        }
        
        this.changePriceItem();
      }
    },
    computed:{
      activeCurrency() {
        return this.$store.getters.activeCurrency;
      }
    },
    watch: {
      activeCurrency() {
        // if currency has changed, change filter options
        this.changePriceMulti();
      },

      resetPriceSlider() {
        const slider = this.$refs['priceslider'];
        const values = slider.setValue([this.options.min, this.options.max]);
      }
    },
    mounted() {
      this.changePriceMulti();
    },
    components: {
      vueSlider
    }
  }
</script>
<style lang="scss" scoped>
  .price-slider {
    padding-top: 10px;
  }
  .slider-info {
    position: relative;
    display: flex;
    justify-content: space-between;
  }
  .seperator {
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
</style>