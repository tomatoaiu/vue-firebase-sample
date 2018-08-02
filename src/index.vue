<template>
  <div>
    {{ word }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  data () {
    return {
      word: "Hello, world"
    }
  }
})
</script>
