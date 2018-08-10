<template>
  <div>
    word: <input type="text" v-model="word">
    <button @click="addItems">Add Item</button>
    <button @click="getItems">Get Item</button>
    <button @click="signIn">Sign in</button>
    <button @click="signOut">Sign out</button>
    {{ sign }}
    <br>
    id: <input type="text" v-model="setId">
    name: <input type="text" v-model="name">
    <button @click="setItem">Set Item</button>
    <button @click="updateItem">Update Item</button>
    <button @click="removeItem">Remove Item</button>
    <button @click="on">On</button>
    <br>
    {{ displayName || '' }} :||: {{ email || '' }} :||: <img :src="photoURL || ''" alt="" height="50px" width="50px"><br>
    <br>
    <ul>
      <li v-for="(value, key, index) in items" :key="index">{{ key }} : {{ value }}</li>
    </ul>
    <br>
    <!-- {{ user }} -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase'
import { firebaseApps, db, auth } from './firebaseConfig'
const dbItemsRef = db.ref('user-data')

export default Vue.extend({
  name: 'App',
  data () {
    return {
      word: 'Hello, world',
      name: '',
      sign: 'Sign ?',
      setId: '',
      user: undefined,
      displayName: '',
      email: '',
      photoURL: '',
      items: []
    }
  },
  mounted () {
    this.on()
  },
  watch: {
    user (next) {
      this.on()
    }
  },
  methods: {
    addItems (): void {
      dbItemsRef.child(`${this.user.uid}/words`).push(this.word)
    },
    updateItem (): void {
      dbItemsRef.child(`${this.user.uid}/words`).update({
        [`${this.setId}`]: this.word
      })
    },
    getItems (): void {
      dbItemsRef.child(`${this.user.uid}/words`).once('value')
      .then((snapshot) => {
        const items = snapshot.val()
        this.items = Object.values(items)
      })
    },
    setItem (): void {
      dbItemsRef.set({
        [`${this.setId}`]: {
          name: this.name
        }
      })
    },
    removeItem (): void {
      dbItemsRef.update({
        [`${this.setId}`]: null
      })
    },
    on (): void {
      if (this.user) {
          dbItemsRef.child(`${this.user.uid}/words`).on('value', (snapshot) => {
          const items = snapshot.val()
          this.items = items
        })
      }
    },
    signIn (): void {
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider).then((result) => {
        this.user = result.user
        this.displayName = this.user.displayName
        this.email = this.user.email
        this.photoURL = this.user.photoURL
        this.on()
        this.sign = 'Sign in'
      })
    },
    signOut (): void {
      auth.signOut().then(() => {
        this.sign = 'Sign out'
      }).catch((error) => {
        // An error happened.
      });
    }
  }
})
</script>

<style scoped>
img {
  border-radius: 10px;
}
</style>

