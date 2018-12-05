import Vue from 'vue';
import Vuex from 'vuex';
import { getters } from './storeGetters';
import { actions } from './storeActions';
import { mutations } from './storeMutations';
import globals from './global-variables';
import getCookie from './modules/getCookie';

Vue.use(Vuex);
const cookieValue = getCookie(globals().currencyCookieName);
const activeCurrency = (cookieValue) ? atob(cookieValue) : globals().standardCurrency;

export const store = new Vuex.Store({
  state: {
    standardCurrency: globals().standardCurrency,
    activeCurrency,
    currencies: {},
    isLoading: false,
    filter: [],
    allProducts: [],
    sortBy: 'highlight',
    sorted: false,
    filteredProducts: {
      selected: false,
      productSteps: globals().productSteps,
      products: [],
      visible: 0,
      allAreVisible: false
    }
    
  },
  getters,
  mutations,
  actions
});
