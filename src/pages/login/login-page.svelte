<script lang="ts">
  import { api } from 'shared/api'
  import { t } from 'shared/i18n'

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
    <h1 class="pt-4">{$t('login.header')}</h1>

    <input
      class="mt-8"
      class:error={hasError}
      type="text"
      autocapitalize="off"
      placeholder={$t('login.username')}
      bind:value={username}
    />
    <input
      class="mt-4"
      class:error={hasError}
      type="password"
      placeholder={$t('login.password')}
      bind:value={password}
    />

    {#if hasError}
      <p class="mt-4 error">unable to login</p>
    {/if}

    <button class="mt-8" type="submit" disabled={!username || !password}>{$t('login.login')}</button>
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

  @media only screen and (max-device-width: 500px) {
    main {
      align-items: stretch;
      background-color: transparent;
    }

    input {
      width: auto;
    }
  }
</style>
