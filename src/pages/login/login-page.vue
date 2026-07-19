<script setup lang="ts">
import { api } from 'shared/api'
import { onMounted, ref } from 'vue'

const username = ref('')
const password = ref('')
const hasError = ref(false)

const handleSubmit = async () => {
  try {
    if (username.value && password.value) {
      await api.auth.login(username.value, password.value)
    }
  } catch {
    hasError.value = true
  }
}

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <main>
    <form @submit.prevent="handleSubmit">
      <h1 class="pt-4">Login</h1>

      <input
        ref="inputRef"
        v-model="username"
        class="mt-8"
        :class="{ error: hasError }"
        type="text"
        autocapitalize="off"
        placeholder="Username"
      >
      <input v-model="password" class="mt-4" :class="{ error: hasError }" type="password" placeholder="Password">

      <p v-if="hasError" class="mt-4 error">unable to login</p>

      <button class="mt-8" type="submit" :disabled="!username || !password">Sign In</button>
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
