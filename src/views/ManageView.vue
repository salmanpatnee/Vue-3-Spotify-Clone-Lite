<script setup>
import { onMounted, ref } from 'vue'
import { tracksCollection, auth } from '@/includes/firebase'
import AppUpload from '@/components/AppUpload.vue'
import TrackItem from '@/components/track/TrackItem.vue'
import { onBeforeRouteLeave } from 'vue-router'

const tracks = ref([])
const isUnsave = ref(false)

const uploadTrackList = (document) => {
  const track = {
    ...document.data(),
    documentId: document.id
  }

  tracks.value.push(track)
}

const updateTrack = (index, values) => {
  tracks.value[index].modified_name = values.modified_name
  tracks.value[index].genre = values.genre
}

const deleteTrack = (index) => {
  tracks.value.splice(index, 1)
}

const handleIsUnsave = (value) => (isUnsave.value = value)

onMounted(async () => {
  const snapshot = await tracksCollection.where('uid', '==', auth.currentUser.uid).get()

  snapshot.forEach(uploadTrackList)
})

onBeforeRouteLeave((to, from) => {
  if (isUnsave.value) {
    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    if (!answer) return false
  }
})
</script>
<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <app-upload :uploadTrackList="uploadTrackList" />
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <track-item
              v-for="(track, index) in tracks"
              :key="track.documentId"
              :track="track"
              :updateTrack="updateTrack"
              :deleteTrack="deleteTrack"
              :handleIsUnsave="handleIsUnsave"
              :index="index"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
