<script lang="ts">
  export let icon: string
  export let size = 32
</script>

<svg height={size} width={size}>
  <use xlink:href={`${icon}#icon`}></use>
</svg>

<style>
  svg {
    flex-shrink: 0;
  }
</style>
