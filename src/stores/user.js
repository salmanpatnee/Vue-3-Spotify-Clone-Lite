import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)

  async function register({ email, password, name, age, country }) {
    const { user } = await auth.createUserWithEmailAndPassword(email, password)

    await usersCollection.doc(user.uid).set({ name, email, age, country })

    await user.updateProfile({
      displayName: name
    })

    isLoggedIn.value = true
  }

  async function login({ email, password }) {
    await auth.signInWithEmailAndPassword(email, password)

    isLoggedIn.value = true
  }

  async function logout() {
    await auth.signOut()

    isLoggedIn.value = false
  }

  return { isLoggedIn, register, login, logout }
})
