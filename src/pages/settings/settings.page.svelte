<script lang="ts">
  import { api } from 'shared/api'
</script>

<button class="mt-4" on:click={api.auth.logout}>Logout</button>
