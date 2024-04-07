<script lang="ts">
  export let title: string = ''
</script>

<div class="card">
  {#if title}
    <h2 class="truncate">{title}</h2>
  {/if}
  <slot />
</div>

<style>
  .card {
    background-color: var(--card);
    border-radius: 1rem;
    padding: 1.5rem;
  }

  h2 {
    font-size: 16px;
    font-weight: bold;
    color: var(--secondary);
  }

  @media only screen and (max-device-width: 500px) {
    .card {
      padding: 1rem;
      border-radius: 0.75rem;
    }
  }
</style>
