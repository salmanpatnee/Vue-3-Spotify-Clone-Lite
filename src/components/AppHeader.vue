<script setup>
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'

const modal = useModalStore()
const user = useUserStore()
const router = useRouter()
const route = useRoute()

const toggleAuthModal = () => (modal.isOpen = !modal.isOpen)

const logout = () => {
  user.logout()

  if (route.meta.requiresAuth) {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        exact-active-class="no-active"
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        >Quran Now</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!user.isLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
