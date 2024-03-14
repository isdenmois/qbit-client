<script lang="ts">
  export let title: string
</script>

<div class="flex flex-col w-full h-full">
  <h2 class="px-8 py-6">{title}</h2>

  <div class="flex-1 px-8 py-6">
    <slot />
  </div>
</div>

<style>
  h2 {
    border-bottom: 1px solid var(--card);
    color: var(--secondary);
    font-size: 14px;
    font-weight: bold;
  }
</style>
