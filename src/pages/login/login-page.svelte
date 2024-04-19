<script lang="ts">
  import { api } from 'shared/api'

  let username = ''
  let password = ''
  let hasError = false

  const handleSubmit = async () => {
    try {
      if (username && password) {
        await api.auth.login(username, password)
      }
    } catch {
      hasError = true
    }
  }
</script>

<main>
  <form on:submit|preventDefault={handleSubmit}>
    <h1 class="pt-4">Login</h1>

    <input
      class="mt-8"
      class:error={hasError}
      type="text"
      autocapitalize="off"
      placeholder="Username"
      bind:value={username}
    />
    <input class="mt-4" class:error={hasError} type="password" placeholder="Password" bind:value={password} />

    {#if hasError}
      <p class="mt-4 error">unable to login</p>
    {/if}

    <button class="mt-8" type="submit" disabled={!username || !password}>Sign In</button>
  </form>
</main>

<style>
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

  /* Mobile */
  :global(#mobile) main {
    align-items: stretch;
    background-color: transparent;
  }

  :global(#mobile) input {
    width: auto;
  }
</style>
