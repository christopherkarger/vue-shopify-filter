<template>
  <button class="save-close" :class="{close: !readyToSave}">
    <template v-if="readyToSave">
      <template v-if="language == 'de'">Speichern</template>
      <template v-if="language == 'en'">Save</template>
    </template>
    <template v-if="!readyToSave">
      <template v-if="language == 'de'">Schließen</template>
      <template v-if="language == 'en'">Close</template>
    </template>
  </button>
</template>
<script>
  import globals from '../js/global-variables';
  export default {
    data() {
      return {
        language: globals().language
      }
    },
    props: ['readyToSave']
  }
</script>
<style lang="scss" scoped>
  .save-close {
    margin: 14px 12px;
    box-sizing: border-box;
    border-radius: 0;
    width: calc(100% - 24px);
    background: #fff;
    border: 1px solid #a2a2a2;
    &:hover {
      background: #333;
      border-color: #333;
      color: #fff;
    }
    &.close {
      border-color: #cd3f3f;
      color: #cd3f3f;
      &:hover {
        background: #cd3f3f;
        color:#fff;
        border-color: #cd3f3f;
      }
    }
    &:focus {
      outline: none;
    }
  }
</style>

