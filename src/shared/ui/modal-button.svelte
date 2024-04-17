<script lang="ts">
  import { Link } from 'svelte-routing'
  import Icon from './icon.svelte'

  export let icon: string
  export let title: string
  export let to: string
</script>

<Link class="nav-link not-link flex flex-col items-center justify-center" {to}>
  <Icon {icon} />
  <div>{title}</div>
</Link>
