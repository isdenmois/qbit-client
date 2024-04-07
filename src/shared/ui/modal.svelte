<script lang="ts">
  import { navigate } from 'svelte-routing'
  import { icons } from './icons'
  import Icon from './icon.svelte'

  export let parent = '/'

  const goBack = () => {
    navigate(parent)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="backdrop" on:click={goBack} />

<div class="modal">
  <div class="panel">
    <button class="button p-5" title="Close" on:click={goBack}>
      <Icon icon={icons.cross} />
    </button>

    <slot name="panel" />
  </div>

  <slot {goBack} />
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background-color: var(--black);
    opacity: 0.5;
  }

  .panel {
    background-color: var(--black);
  }

  button {
    background-color: var(--black);
    color: var(--secondary);
  }
  button:hover {
    color: var(--primary);
  }

  .modal {
    overflow: hidden;
    overscroll-behavior: contain;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(55rem, 100%);

    background-color: var(--background);
    box-shadow: -8px 0px 16px -4px rgba(0, 0, 0, 0.1);
    display: flex;
  }

  @media only screen and (max-device-width: 500px) {
    .modal {
      width: 100%;
      flex-direction: column-reverse;
    }
  }
</style>
