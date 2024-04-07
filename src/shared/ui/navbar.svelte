<script lang="ts">
  import { Link } from 'svelte-routing'
</script>

<nav>
  <Link class="nav-link" to="/">Dashboard</Link>
  <Link class="nav-link" to="/torrents">Torrents</Link>
  <Link class="nav-link" to="/settings">Settings</Link>
</nav>

<style>
  nav {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--black);
    text-align: center;
  }

  @media only screen and (max-device-width: 500px) {
    nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      flex-direction: row;
    }

    nav :global(.nav-link) {
      flex: 1;
    }
  }
</style>
