<script lang="ts">
  export let title: string
</script>

<div class="flex flex-col w-full h-full overflow-hidden">
  <h2 class="px-4 md:px-8 py-6 break-words">{title}</h2>

  <div class="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
    <slot />
  </div>

  <slot name="bottom" />
</div>

<style>
  h2 {
    border-bottom: 1px solid var(--card);
    color: var(--secondary);
    font-size: 14px;
    font-weight: bold;
  }
</style>
