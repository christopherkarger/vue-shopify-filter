<template>  
  <div>
    <app-filter></app-filter>
    <app-products></app-products>
    <loading></loading>
  </div>
</template>
 
<script>
  import globals from '../js/global-variables';
  import Filter from './Filter.vue';
  import Products from './Products.vue';
  import Loading from './Loading.vue';
  import getCookie from '../js/modules/getCookie';

  export default {
    components: {
      appFilter: Filter,
      loading: Loading,
      appProducts: Products
    },
    created() {
      this.$store.dispatch('getJSON');
    }    
  }
</script>
