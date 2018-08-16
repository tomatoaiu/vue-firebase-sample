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
      <li>on value</li>
      <li v-for="(value, key, index) in items" :key="index">{{ key }} : {{ value }}</li>
    </ul>
    <ul>
      <li>on child_add</li>
      <li v-for="(value, key, index) in childAddedItems" :key="index">{{ key }} : {{ value }}</li>
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

interface StringMap { [key: string]: string }

export default Vue.extend({
  name: 'App',
  data () {
    return {
      word: <string> 'Hello, world',
      name: <string> '',
      sign: <string> 'Sign ?',
      setId: <string> '',
      user: <firebase.User> {},
      displayName: <string> '',
      email: <string> '',
      photoURL: <string> '',
      items: <string[]> [],
      childAddedItems: <StringMap[]> [],
      localTime: <string> ''
    }
  },
  async mounted () {
    this.items = this.getLocalStorage()
    this.localTime = this.getLocalTimeStamp()
    console.log(this.items, this.localTime)
  },
  methods: {
    getLocalTimeStamp (): string {
      if ('timestamp' in localStorage) {
        return String(JSON.parse(localStorage.getItem('timestamp')!))
      } else {
        return ''
      }
    },
    getLocalStorage (): string[] {
      if ('words' in localStorage) {
        return JSON.parse(localStorage.getItem('words')!)
      } else {
        return []
      }
    },
    setLocalStorage (): void {
      localStorage.setItem('words', JSON.stringify(this.items))
      localStorage.setItem('timestamp', JSON.stringify(new Date()))
    },
    addItems (): void {
      this.items.push(this.word)
      this.setLocalStorage()
      if (this.user && 'uid' in this.user) {
        dbItemsRef.child(`${this.user.uid}/words`).push(this.word)
        dbItemsRef.child(`${this.user.uid}`).update({
          timestamp: new Date()
        })
      }
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
    getRemoteTimeStamp () {
      return dbItemsRef.child(`${this.user.uid}/timestamp`).once('value')
      .then((snapshot) => {
        return snapshot.val()
      })
    },
    setItems (items: Array<String>) {
      dbItemsRef.child(`${this.user.uid}`).set({
        timestamp: new Date(),
        words: items
      })
    },
    setItem (): void {
      dbItemsRef.child(`${this.user.uid}/words`).set({
        [`${this.setId}`]: {
          name: this.name
        }
      })
    },
    removeItem (): void {
      dbItemsRef.child(`${this.user.uid}/words`).update({
        [`${this.setId}`]: null
      })
    },
    on (): void {
      if (this.user) {
          dbItemsRef.child(`${this.user.uid}/words`).on('value', (snapshot) => {
          const items = snapshot!.val()
          this.items = items
        })
      }
    },
    childAdded (): void {
      if (this.user) {
        dbItemsRef.child(`${this.user.uid}/words`).on('child_added', (data) => {
          this.childAddedItems.push({
            [`${data!.key}`]: data!.val()
          })
        })
      }
    },
    async signIn () {
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider).then((result) => {
        this.user = result.user!
        this.displayName = this.user.displayName!
        this.email = this.user.email!
        this.photoURL = this.user.photoURL!
        // this.childAdded()
        this.sign = 'Sign in'
        
        dbItemsRef.child(`${this.user.uid}/timestamp`).once('value')
        .then((snapshot) => {
          const remoteTime = snapshot.val()
          console.log(this.localTime, remoteTime, !remoteTime || this.localTime > remoteTime)
          if (!remoteTime || new Date(this.localTime) > new Date(remoteTime)) {
            const items = this.getLocalStorage()
            this.setItems(items)
            this.on()
          } else {
            this.on()
          }
        }).catch((err) => {
          console.log(err)
        })

        
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

