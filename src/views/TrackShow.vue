<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { tracksCollection, auth, commentsCollection } from '@/includes/firebase'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePlayerStore } from '@/stores/player'
import { useI18n } from 'vue-i18n'

const { t, n } = useI18n()

const user = useUserStore()
const player = usePlayerStore()

const route = useRoute()
const router = useRouter()
const track = ref({})

const submission_inprocess = ref(false)
const show_alert = ref(false)
const alert_variant = ref('bg-blue-500')
const alert_msg = ref('Please wait! Your commnet is being sent.')

const comments = ref([])
const sortOrder = ref('asc')

const sortedComments = computed(() => {
  const sorted = [...comments.value]

  return sorted.sort((a, b) => {
    if (sortOrder.value === 'asc') {
      return new Date(b.datePosted) - new Date(a.datePosted)
    }
    return new Date(a.datePosted) - new Date(b.datePosted)
  })
})

const getTrack = async () => {
  const snapshot = await tracksCollection.doc(route.params.id).get()

  if (!snapshot.exists) {
    router.push({ name: 'home' })
    return
  }

  track.value = snapshot.data()
}

const getComments = async () => {
  comments.value = []

  const snapshot = await commentsCollection.where('trackId', '==', route.params.id).get()

  snapshot.forEach((document) => {
    const comment = {
      ...document.data(),
      documentId: document.id
    }

    comments.value.push(comment)
  })
}

const schema = {
  comment: 'required|min:3'
}

const submit = async (values, { resetForm }) => {
  submission_inprocess.value = true
  show_alert.value = true

  try {
    const comment = {
      trackId: route.params.id,
      userId: auth.currentUser.uid,
      content: values.comment,
      datePosted: new Date().toString(),
      name: auth.currentUser.displayName
    }

    await commentsCollection.add(comment)

    track.value.comments_count += 1

    await tracksCollection
      .doc(route.params.id)
      .update({ comments_count: track.value.comments_count })

    getComments()
  } catch (error) {
    submission_inprocess.value = false
    alert_variant.value = 'bg-red-600'
    alert_msg.value = 'An enexpected error occured.'
    return
  }
  submission_inprocess.value = false
  alert_variant.value = 'bg-green-500'
  alert_msg.value = 'Hurray! You comment is published.'

  resetForm()
}

watch(sortOrder, (newVal) => {
  if (newVal === route.query.sort) {
    return
  }

  router.push({
    query: {
      sort: newVal
    }
  })
})

onMounted(async () => {
  await getTrack()
  await getComments()

  const { sort } = route.query

  sortOrder.value = sort === 'asc' || sort === 'desc' ? sort : 'asc'
})
</script>

<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="player.newSong(track)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i
            class="fas"
            :class="{ 'fa-pause': player.isPlaying, 'fa-play': !player.isPlaying }"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ track.modified_name }}</div>
          <div>{{ track.genre }}</div>
          <div>{{ n(2, 'currency') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{ t('track.comment_count', track.comments_count) }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 rounded mb-4"
            :class="alert_variant"
            v-show="show_alert"
          >
            {{ alert_msg }}
          </div>
          <vee-form :validation-schema="schema" @submit="submit" v-if="user.isLoggedIn">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              :placeholder="t('form.comment_placeholder')"
            ></vee-field>
            <ErrorMessage name="comment" class="text-red-600" />
            <button
              :disabled="submission_inprocess"
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              {{ t('form.submit_button') }}
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sortOrder"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="asc">{{ t('form.latest') }}</option>
            <option value="desc">{{ t('form.oldest') }}</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.documentId"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>
