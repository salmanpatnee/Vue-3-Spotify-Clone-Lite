<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  track: {
    type: Object,
    required: true
  }
})

const show = () => {
  router.push({ name: 'track.show', params: { id: props.track.documentId } })
}
</script>

<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div @click.prevent="show">
      <a class="font-bold block text-gray-600">{{ track.modified_name }} </a>
      <span class="text-gray-500 text-sm">{{ track.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link
        :to="{ name: 'track.show', params: { id: track.documentId }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ track.comments_count }}
        </span>
      </router-link>
    </div>
  </li>
</template>
