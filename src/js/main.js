import Vue from 'vue';
import App from '../vue/App.vue';
import { store } from './store';
import globals from './global-variables';

document.addEventListener("DOMContentLoaded", (event) => {
  if (location.search.length == 0) {
    if (globals(true).filterApp) {
      new Vue({
        el: '#filter-app',
        store: store,
        render: h => h(App)
      });
    }
  }  
});
