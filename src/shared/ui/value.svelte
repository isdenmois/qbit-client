<script lang="ts">
  export let title: string
</script>

<div class="wrapper flex items-center">
  <div class="title w-60">{title}</div>
  <div class="value">
    <slot />
  </div>
</div>

<style>
  .title {
    color: var(--secondary);
  }

  /* Mobile */
  :global(#mobile) .wrapper {
    flex-direction: column;
    align-items: start;
    gap: 0.25rem;
  }

  :global(#mobile) .title {
    font-size: 14px;
  }
</style>
