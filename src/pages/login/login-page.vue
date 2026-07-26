<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLoginFormStore } from './model'

const { username, password, submit, submitDisabled, submitting, errorClass, hasError } = useLoginFormStore()

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <main>
    <form @submit.prevent="submit">
      <h1 class="pt-4">Login</h1>

      <input
        ref="inputRef"
        v-model="username"
        class="mt-8"
        :class="errorClass"
        :disabled="submitting"
        type="text"
        autocapitalize="off"
        placeholder="Username"
      >
      <input
        v-model="password"
        class="mt-4"
        :class="errorClass"
        :disabled="submitting"
        type="password"
        placeholder="Password"
      >

      <p v-if="hasError" class="mt-4 error">unable to login</p>

      <button class="mt-8" type="submit" :disabled="submitDisabled">Sign In</button>
    </form>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: var(--black);
}

form {
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  padding: 2rem 1.5rem;
  border-radius: 1rem;
}

h1 {
  text-align: center;
}

input {
  width: 16rem;
}

input.error {
  border-bottom-color: var(--error);
}

.error {
  color: var(--error);
}

@screen lt-sm {
  main {
    align-items: stretch;
    background-color: transparent;
  }

  input {
    width: auto;
  }
}
</style>
