<script setup>
import { ref } from 'vue'
import { storage, tracksCollection } from '@/includes/firebase'

const props = defineProps({
  track: {
    type: Object,
    required: true
  },
  updateTrack: {
    type: Function,
    required: true
  },
  deleteTrack: {
    type: Function,
    required: true
  },
  handleIsUnsave: {
    type: Function,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const submission_inprocess = ref(false)
const show_alert = ref(false)
const alert_variant = ref('bg-blue-500')
const alert_msg = ref('Please wait! Your track is being updated.')

const isEditing = ref(false)

const trackData = {
  modified_name: props.track.modified_name,
  genre: props.track.genre
}

const schema = {
  modified_name: 'required|min:3|max:100',
  genre: 'alpha_spaces'
}

const submit = async (values) => {
  submission_inprocess.value = true
  show_alert.value = true

  try {
    await tracksCollection.doc(props.track.documentId).update(values)
  } catch (error) {
    submission_inprocess.value = false
    alert_variant.value = 'bg-red-600'
    alert_msg.value = 'An enexpected error occured.'
    console.log(error)
    return
  }
  props.handleIsUnsave(false)
  submission_inprocess.value = false
  alert_variant.value = 'bg-green-500'
  alert_msg.value = 'Hurray! You track is updated.'

  props.updateTrack(props.index, values)
}

const remove = async () => {
  const storageRef = storage.ref()
  const tracksRef = storageRef.child(`tracks/${props.track.original_name}`)

  await tracksRef.delete()
  await tracksCollection.doc(props.track.documentId).delete()

  props.deleteTrack(props.index)
}
</script>

<template>
  <!-- Composition Items -->
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!isEditing">
      <h4 class="inline-block text-2xl font-bold">{{ track.modified_name }}</h4>
      <button
        @click.prevent="remove"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        @click.prevent="isEditing = true"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="isEditing">
      <div
        class="text-white text-center font-bold p-4 rounded mb-4"
        :class="alert_variant"
        v-show="show_alert"
      >
        {{ alert_msg }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="trackData" @submit="submit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="handleIsUnsave(true)"
          />
          <ErrorMessage name="modified_name" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="handleIsUnsave(true)"
          />
          <ErrorMessage name="genre" class="text-red-600" />
        </div>
        <button
          type="submit"
          :disabled="submission_inprocess"
          class="py-1.5 px-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          type="button"
          @click.prevent="isEditing = false"
          :disabled="submission_inprocess"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>
