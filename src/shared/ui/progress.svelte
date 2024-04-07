<script lang="ts">
  export let value: number
  export let secondary = false
</script>

<progress class="block w-a" class:secondary max="1" {value} />

<style>
  progress {
    appearance: none;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
  }

  progress::-webkit-progress-bar {
    background-color: var(--progress-background);
  }

  progress::-webkit-progress-value {
    background-color: var(--success);
  }

  progress.secondary::-webkit-progress-value {
    background-color: var(--secondary);
  }

  @media only screen and (max-device-width: 500px) {
    progress {
      height: 6px;
      border-radius: 3px;
    }
  }
</style>
