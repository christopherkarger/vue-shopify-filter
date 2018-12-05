<template>
  <div class="main-wrapper" v-if="filterLoaded">
    <div class="filter-wrapper">
      <h4>
        <template v-if="language == 'de'">Filter nach</template>
        <template v-if="language == 'en'">Filter for</template>
      </h4>

      <div class="filter-wrapper-inner">
        <div class="dropdown-item size" :class="{active: showFilter.size, selected: isFilterSelected(['size'])}" v-if="filtersize.value.length > 1">
          <div class="dropdown-item__header" @click="toggleFilter('size')">
            {{ filtersize.dropdownText }}
          </div>
          <div class="dropdown-item__container">
            <ul>
                <li v-for="(value, index) in filtersize.value" :key="index" >
                  <input type="checkbox" :id="setID('size', index)" :value="value" v-model="checkboxesSize"/>
                  <label :for="setID('size', index)" @click="handleFilter(index, 'size')">{{ value }}</label>
                </li>
              </ul>
          </div>
          
          <save-close :readyToSave="readyToSave" @click.native="updateFilter"></save-close>

        </div>
        
        <div class="dropdown-item vendor" :class="{active: showFilter.vendor, selected: isFilterSelected(['vendor'])}" v-if="filtervendor.value.length > 1">
          <div class="dropdown-item__header" @click="toggleFilter('vendor')">
            {{ filtervendor.dropdownText }}
          </div>
          <div class="dropdown-item__container">  
            <ul>
              <li v-for="(value, index) in filtervendor.value" :key="index">
                <input type="checkbox" :id="setID('vendor', index)" :value="value" v-model="checkboxesVendor"/>
                <label :for="setID('vendor', index)" @click="handleFilter(index, 'vendor')">{{ value | decodeURI }}</label>
              </li>
            </ul>
          </div>
          <save-close :readyToSave="readyToSave" @click.native="updateFilter"></save-close>
        </div>

        <div class="dropdown-item price" :class="{active: showFilter.price, selected: isFilterSelected(['price', 'sale', 'onlyavailable'])}" v-if="filterprice.value.length > 0">
          <div class="dropdown-item__header" @click="toggleFilter('price')">
            {{ filterprice.dropdownText }}
          </div>
          <div class="dropdown-item__container">
            <div class="dropdown-item__wrapper">
              <price-slider :minPrice="filterprice.value[0]" :maxPrice="filterprice.value[1]" @pricechange="priceChange" :resetPriceSlider="resetPriceSlider"></price-slider>
              <div class="only-sale">
                <input type="checkbox" id="onlysale" v-model="checkboxSale"/>
                <label for="onlysale" @click="handleFilter(true, 'sale')">
                  <template v-if="language == 'de'">Nur Sonderangebote</template>
                  <template v-if="language == 'en'">Only special offers</template>
                </label>
              </div>
               <div class="only-available">
                <input type="checkbox" id="onlyavailable" v-model="checkboxAvailable"/>
                <label for="onlyavailable" @click="handleFilter(true, 'onlyavailable')">
                  <template v-if="language == 'de'">Nur verfügbare Produkte</template>
                  <template v-if="language == 'en'">Only available products</template>
                </label>
              </div>
            </div>
          </div>
          <save-close :readyToSave="readyToSave" @click.native="updateFilter"></save-close>
        </div>

        <div class="dropdown-item color" :class="{active: showFilter.color, selected: isFilterSelected(['color'])}" v-if="filtercolor.value.length > 1">
          <div class="dropdown-item__header" @click="toggleFilter('color')">
            {{ filtercolor.dropdownText }}
            </div>
          <div class="dropdown-item__container">
            <ul>
              <li v-for="(value, index) in filtercolor.value" :key="index" :class="setColorClass(value)">
                <input type="checkbox" :id="setID('color', index)" :value="value" v-model="checkboxesColor"/>
                <label :for="setID('color', index)" @click="handleFilter(index, 'color')">{{ value }}</label>
              </li>
            </ul>
          </div>
          <save-close :readyToSave="readyToSave" @click.native="updateFilter"></save-close>
        </div>
      </div>
    </div>

    <div class="filter-bottom">
      <div class="reset-filter" v-if="filterIsSelected">
        <button @click="resetAllFilter">
          <template v-if="language == 'de'">Filter zurücksetzen</template>
          <template v-if="language == 'en'">Reset filter</template>
        </button>
      </div>

      <div class="sort-products">
        <div>
          <p v-if="language == 'de'">Sortieren nach:</p>
          <p v-if="language == 'en'">Sort by:</p>
        </div>
        <div class="select-wrapper">
          <select @change="changeSortByMethod">
            <option value="sale">
              <template v-if="language == 'de'">Im Highlight</template>
              <template v-if="language == 'en'">Featured</template>
            </option>
            <option value="new_down">
              <template v-if="language == 'de'">Neuheiten</template>
              <template v-if="language == 'en'">New In</template>
            </option>
            <option value="price_up">
              <template v-if="language == 'de'">Preis aufsteigend</template>
              <template v-if="language == 'en'">Price, low to high</template>
            </option>
            <option value="price_down">
              <template v-if="language == 'de'">Preis absteigend</template>
              <template v-if="language == 'en'">Price, high to low</template>
            </option>
            <option value="alpha_az">
              <template v-if="language == 'de'">Alphabetisch A-Z</template>
              <template v-if="language == 'en'">Alphabetically, A-Z</template>
            </option>
            <option value="alpha_za">
              <template v-if="language == 'de'">Alphabetisch Z-A</template>
              <template v-if="language == 'en'">Alphabetically, Z-A</template>
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PriceSlider from './PriceSlider.vue';
  import globals from '../js/global-variables';
  import translate from '../js/modules/translate';
  import SaveClose from './SaveClose.vue';
  
  const filterSelected = {
    size: [],
    vendor: [],
    color: [],
    price: [],
    sale: []
  };

  export default {
    data() {
      return {
        language: globals().language,
        filterLoaded: false,
        readyToSave: false, 
        filterSelected,
        activeFilterString: null,
        initFilterString: null,
        activeFilterCategories: [],
        showFilter: {
          size: false,
          vendor: false,
          color: false,
          price: false
        },
        filtersize: null,
        filtervendor: null,
        filtercolor: null,
        filterprice: null,
        checkboxesSize: [],
        checkboxesVendor: [],
        checkboxesColor: [],
        checkboxSale: null,
         checkboxAvailable: null,
        resetPriceSlider: false
      }
    },

    components: {
      saveClose: SaveClose,
      priceSlider: PriceSlider
    },

    methods: {
      changeSortByMethod(evt) {
        const filtered = this.$store.getters.allFilteredProducts.length > 0;
        this.$store.dispatch('updateSorting', { method: evt.target.value, filtered });
      },
      
      setID(prefix, index) {
        index += 1; 
        return (prefix + index);
      },
     
      toggleFilter(name) {
        this.showFilter[name] = !this.showFilter[name];

        for (let elm in this.showFilter) {
          if (elm !== name) {
            this.showFilter[elm] = false;
          }
        }
      },

      priceChange(val) {
        this.handleFilter(val, 'price');
      },

      setColorClass(colorClass) {
        return 'cl-' + colorClass.toLowerCase();
      },

      hasFilterChanged() {
        return this.activeFilterString !== JSON.stringify(this.filterSelected);
      },

      handleFilter(value, name) {
        const getters = this.$store.getters;
        const storeFilter = getters.filterItem(name);

        if (typeof value === 'number' && isFinite(value)) {
          value = storeFilter.value[value];
        }
        
        const filterSelected = this.filterSelected[name];

        if (name == 'price') {

          filterSelected[0] = parseFloat(value[0]);
          filterSelected[1] = parseFloat(value[1]);
          
        } else {
          let valPos = filterSelected.indexOf(value);
          if (valPos > -1) {
            filterSelected.splice(valPos, 1);
          } else {
            filterSelected.push(value);
          }
        }

        this.readyToSave = this.hasFilterChanged();
        
      },

      resetAllFilter() {
        this.filterSelected = JSON.parse(this.initFilterString);
        this.checkboxesSize = [];
        this.checkboxesVendor = [];
        this.checkboxesColor = [];
        this.checkboxSale = false;
        this.checkboxAvailable = false;
        this.resetPriceSlider = !this.resetPriceSlider;
        this.updateFilter();
      },

      updateFilter() {
        if (this.hasFilterChanged()) {
          // add only selected filter
          const selectedFilter = {};
          this.activeFilterCategories = [];
          const filterItemPrice = this.$store.getters.filterItem('price').value;

          for (let key in this.filterSelected) {
            if (this.filterSelected[key].length > 0) {
              selectedFilter[key] = this.filterSelected[key];
                            if (key == 'price') {
                if ((filterItemPrice[0] !==  selectedFilter[key][0]) 
                  || (filterItemPrice[1] !==  selectedFilter[key][1])) {
                    this.activeFilterCategories.push(key);
                }

              } else {
                this.activeFilterCategories.push(key);
              }
            }
          }

          let atLeastOneFilterSelected = false;
          this.activeFilterString = JSON.stringify(this.filterSelected);
          
          if (this.initFilterString !== this.activeFilterString) {
            atLeastOneFilterSelected = true;
          }
          
          this.$store.dispatch('updateFilteredProducts', { selectedFilter, atLeastOneFilterSelected });
          this.readyToSave = false;
          
        }

        this.closeAllFilter();
      },

      closeAllFilter() {
        for (let filterName in this.showFilter) {
          this.showFilter[filterName] = false;
        }
      },
      
      isFilterSelected(arr) {
        const activeFilterCategories = this.activeFilterCategories;
        let isActive = false;

        if (activeFilterCategories.length > 0) {
          arr.forEach((elm) => {
            if (activeFilterCategories.indexOf(elm) > -1) {
              isActive = true;
            };
          });
        }
      
        return isActive;
      } 
    },

    computed: {
      filter() {
        const filter = JSON.stringify(this.$store.getters.filter);
        return JSON.parse(filter);
      },

      filterIsSelected() {
        return this.$store.getters.filterSelectedStatus;
      },

      isLoading() {
        return this.$store.getters.isLoading;
      }
    },

    filters: {
      decodeURI(data) {
        return decodeURIComponent(data);
      }
    },
    
    watch: {
      filter() {
        this.filter.forEach((elm,index) => { 
          if (elm.translate) {
            elm.dropdownText = translate(elm, elm.dropdownText);
            if (Array.isArray(elm.value)) {
              elm.value = translate(elm, elm.value);  
            }
          }
          
          // If value is a string not an array
          elm.value = (!Array.isArray(elm.value)) ? [elm.value] : elm.value;
          this['filter' + elm.name] = elm;

          if (elm.name == 'price') {
            this.filterSelected.price = elm.value;
          }
        });

        this.filterLoaded = true;
        this.activeFilterString = JSON.stringify(this.filterSelected);
        this.initFilterString = JSON.stringify(this.filterSelected);
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import '../scss/filter.scss';
</style>