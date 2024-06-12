<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const { login } = useUserStore()

const submission_inprocess = ref(false)
const show_alert = ref(false)
const alert_variant = ref('bg-blue-500')
const alert_msg = ref('Please wait!')

const schema = {
  email: 'required|email',
  password: 'required'
}

const submit = async (values) => {
  submission_inprocess.value = true
  show_alert.value = true

  try {
    await login(values)
  } catch (error) {
    submission_inprocess.value = false
    alert_variant.value = 'bg-red-600'
    alert_msg.value = 'Invalid login details.'
    return
  }

  alert_variant.value = 'bg-green-500'
  alert_msg.value = 'Your are now logged in.'
  window.location.reload()
}
</script>

<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    :class="alert_variant"
    v-show="show_alert"
  >
    {{ alert_msg }}
  </div>

  <!-- Login Form -->
  <vee-form :validation-schema="schema" @submit="submit">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage name="email" class="text-red-600" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage name="password" class="text-red-600" />
    </div>
    <button
      type="submit"
      :disabled="submission_inprocess"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>
