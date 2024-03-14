<script lang="ts">
  import { Router, Route } from 'svelte-routing'
  import { HomePage } from 'pages/home'
  import { TorrentDetailsPage } from 'pages/details'
  import { Modal, NavBar } from 'shared/ui'
</script>

<div class="root">
  <Router>
    <NavBar />

    <main>
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
        </Router>
      </Route>
    </main>
  </Router>
</div>

<style>
  .root {
    display: flex;
    flex: 1;
    background-color: var(--black);
  }

  main {
    margin: 1.5rem 1.5rem 1.5rem 0;
    flex: 1;
    background-color: var(--background);
    border-radius: 2rem;
    padding: 3rem;
  }

  @media only screen and (max-device-width: 640px) {
    .root {
      flex-direction: column;
    }

    main {
      margin: 0;
      border-radius: 0;
      padding: 1rem;
    }
  }
</style>
