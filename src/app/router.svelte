<script lang="ts">
  import { Router, Route } from 'svelte-routing'
  import { HomePage } from 'pages/home'
  import { TorrentDetailsPage } from 'pages/details'
  import { LimitsPage } from 'pages/limits'
  import { SettingsPage } from 'pages/settings'
  import { Modal } from 'shared/ui'
  import NavBar from './navbar.svelte'
</script>

<div class="root">
  <Router>
    <NavBar />

    <main>
      <div class="content">
        <Route path="/settings" component={SettingsPage} />

        <Route path="/torrents">Not implemented yet</Route>

        <Route path="/*">
          <HomePage />

          <Router>
            <Route path="torrent/:id" let:params>
              <Modal>
                <Router>
                  <Route>
                    <TorrentDetailsPage id={params.id} />
                  </Route>
                </Router>
              </Modal>
            </Route>

            <Route path="limits">
              <Modal>
                <LimitsPage />
              </Modal>
            </Route>
          </Router>
        </Route>
      </div>
    </main>
  </Router>
</div>

<style>
  .root {
    display: flex;
    flex: 1;
    background-color: var(--black);
    justify-content: center;
  }

  main {
    margin: 1.5rem 1.5rem 1.5rem 0;
    flex: 1;
    background-color: var(--background);
    border-radius: 2rem;
    padding: 2rem;
    height: calc(100vh - 9rem);
    display: flex;
    max-width: 80rem;
  }

  .content {
    padding: 1rem;
    flex: 1;
    overflow-y: auto;
  }

  @media only screen and (max-device-width: 500px) {
    .root {
      flex-direction: column;
      max-height: 100dvh;
    }

    main {
      margin: 0;
      border-radius: 0;
      padding: 0;
    }

    .content {
      padding-bottom: 5rem;
    }
  }
</style>
