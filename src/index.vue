<template>
  <div>
    <input type="text" v-model="word">
    <button @click="addItems">Add Item</button>
    <button @click="getItems">Get Item</button>
    <button @click="signIn">Sign in</button>
    <button @click="signOut">Sign out</button>
    {{ sign }}
    <br>
    {{ user }}
    <br>
    <ul>
      <li v-for="(item, i) of items" :key="i">{{ item }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase'
import { dbItemsRef } from './firebaseConfig'

export default Vue.extend({
  name: 'App',
  data () {
    return {
      word: 'Hello, world',
      sign: 'Sign ?',
      user: undefined,
      items: undefined
    }
  },
  mounted () {
    this.on()
  },
  methods: {
    addItems (): void {
      dbItemsRef.push(this.word)
    },
    getItems (): void {
      dbItemsRef.once('value')
      .then((snapshot) => {
        const items = snapshot.val()
        this.items = Object.values(items)
      })
    },
    on (): void {
      dbItemsRef.on('value', (snapshot) => {
        const items = snapshot.val()
        this.items = Object.values(items)
      })
    },
    signIn (): void {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then((result) => {
        this.user = result.user
      })
      this.sign = 'Sign in'
    },
    signOut (): void {
      firebase.auth().signOut().then(() => {
        this.sign = 'Sign out'
      }).catch((error) => {
        // An error happened.
      });
    }
  }
})
</script>
