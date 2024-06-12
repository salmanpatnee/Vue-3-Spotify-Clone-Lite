<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const { register } = useUserStore()

const submission_inprocess = ref(false)
const show_alert = ref(false)
const alert_variant = ref('bg-blue-500')
const alert_msg = ref('Please wait! Your account is being created.')

const schema = {
  name: 'required|min:3|max:100|alpha_spaces',
  email: 'required|email',
  age: 'required|min_value:18|max_value:100',
  password: 'required|min:6|max:100|excluded:password',
  password_confirm: 'confirmed:@password',
  country: 'required',
  tos: 'tos'
}

const userData = {
  country: 'USA'
}

const submit = async (values) => {
  submission_inprocess.value = true
  show_alert.value = true

  try {
    await register(values)
  } catch (error) {
    submission_inprocess.value = false
    alert_variant.value = 'bg-red-600'
    alert_msg.value = 'An enexpected error occured.'
    return
  }

  alert_variant.value = 'bg-green-500'
  alert_msg.value = 'Hurray! You account is created.'
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
  <!-- Registration Form -->
  <vee-form :validation-schema="schema" :initial-values="userData" @submit="submit">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage name="name" class="text-red-600" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage name="email" class="text-red-600" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage name="age" class="text-red-600" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage name="password" class="text-red-600" />
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        name="password_confirm"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage name="password_confirm" class="text-red-600" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
      </vee-field>
      <ErrorMessage name="country" class="text-red-600" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded block"
        value="1"
      />
      <label class="block">Accept terms of service</label>
      <ErrorMessage name="tos" class="text-red-600" />
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
