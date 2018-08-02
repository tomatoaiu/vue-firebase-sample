<template>
  <div>
    {{ word }}
    <button @click="addItems">Add Item</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { dbItemsRef } from './firebaseConfig'

export default Vue.extend({
  name: 'App',
  data () {
    return {
      word: "Hello, world"
    }
  },
  methods: {
    addItems (): void {
      dbItemsRef.push(this.word)
    }
  }
})
</script>
