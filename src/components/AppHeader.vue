<script setup>
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
const { locale, t } = useI18n({ useScope: 'global' })

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

const changeLocale = () => {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}

const currentLocale = computed(() => {
  return locale.value === 'ar' ? 'English' : 'Arabic'
})
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
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">{{
              t('menu.login')
            }}</a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                t('menu.manage')
              }}</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout">{{ t('menu.logout') }}</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a @click.prevent="changeLocale" class="px-2 text-white" href="#">{{
              currentLocale
            }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
