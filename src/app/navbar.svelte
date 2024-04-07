<script lang="ts">
  import { Link } from 'svelte-routing'
  import { t } from 'shared/i18n'
  import { Icon, icons } from 'shared/ui'
</script>

<nav>
  <Link class="nav-link not-link" to="/">
    <div class="icon">
      <Icon size={40} icon={icons.home} />
    </div>

    <div>{$t('nav.dashboard')}</div>
  </Link>

  <Link class="nav-link not-link" to="/torrents">
    <div class="icon">
      <Icon size={40} icon={icons.list} />
    </div>

    <div>{$t('nav.torrents')}</div></Link
  >

  <Link class="nav-link not-link" to="/settings">
    <div class="icon">
      <Icon size={40} icon={icons.settings} />
    </div>

    <div>{$t('nav.settings')}</div></Link
  >
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
    gap: 1.5rem;
  }

  :global(.nav-link[aria-current='page']) .icon {
    color: var(--selected);
  }

  @media only screen and (max-device-width: 500px) {
    nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      flex-direction: row;
      font-size: 12px;
      gap: 0;
    }

    nav :global(.nav-link) {
      flex: 1;
    }
  }
</style>
