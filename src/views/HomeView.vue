<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { tracksCollection } from '@/includes/firebase'
import TrackItem from '@/components/track/TrackItem.vue'
import vIconSecondary from '@/directives/icon-secondary'

const { t } = useI18n()

const tracks = ref([])
const perPage = ref(25)
const inProcess = ref(false)

const getTracks = async () => {
  let snapshots
  inProcess.value = true

  if (tracks.value.length) {
    const lastDoc = await tracksCollection
      .doc(tracks.value[tracks.value.length - 1].documentId)
      .get()

    snapshots = await tracksCollection
      .orderBy('modified_name')
      .startAfter(lastDoc)
      .limit(perPage.value)
      .get()
  } else {
    snapshots = await tracksCollection.orderBy('modified_name').limit(perPage.value).get()
  }

  snapshots.forEach((document) => {
    tracks.value.push({
      ...document.data(),
      documentId: document.id
    })
  })

  inProcess.value = false
}

const handleScroll = () => {
  const { scrollTop, offsetHeight } = document.documentElement
  const { innerHeight } = window
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

  if (bottomOfWindow && !inProcess.value) {
    getTracks()
  }
}

onMounted(async () => {
  getTracks()

  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ t('home.listen') }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            {{ t('home.para') }}
          </p>
          <span class="card-title">{{ t('home.card_title') }}</span>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <!-- <span class="card-title">{{ t('home.card_title') }}</span> -->
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title" v-text="t('home.card_title')"></span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <track-item v-for="track in tracks" :key="track.documentId" :track="track" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>
