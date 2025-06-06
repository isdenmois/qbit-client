<script lang="ts">
  import { Router, Route } from 'svelte-routing'
  import { HomePage } from 'pages/home'
  import { CategoryPage, TorrentDetailsPage } from 'pages/details'
  import { LimitsPage } from 'pages/limits'
  import { SettingsPage } from 'pages/settings'
  import { SearchPage } from 'pages/search'
  import { AddPage } from 'pages/add'
  import { ContentPage } from 'pages/content'
  import { TorrentsPage } from 'pages/torrents'
  import { Modal, icons } from 'shared/ui'
  import NavBar from './navbar.svelte'
  import ModalPanel from 'shared/ui/modal-panel.svelte'
  import ModalButton from 'shared/ui/modal-button.svelte'
</script>

<div class="root">
  <Router>
    <NavBar />

    <main>
      <div class="content">
        <Route path="/settings" component={SettingsPage} />

        <Route path="/torrents" component={TorrentsPage} />

        <Route path="/search" component={SearchPage} />

        <Route path="/*">
          <HomePage />

          <Router>
            <Route path="torrent/:id/*" let:params>
              <Modal>
                <Router>
                  <Route path="/content">
                    <ContentPage id={params.id} />
                  </Route>

                  <Route path="/category">
                    <CategoryPage id={params.id} />
                  </Route>

                  <Route>
                    <TorrentDetailsPage id={params.id} />
                  </Route>
                </Router>

                <ModalPanel slot="panel">
                  <ModalButton to={`torrent/${params.id}`} title="Home" icon={icons.search} />
                  <ModalButton to={`torrent/${params.id}/content`} title="Content" icon={icons.list} />
                  <ModalButton to={`torrent/${params.id}/category`} title="Category" icon={icons.folder} />
                </ModalPanel>
              </Modal>
            </Route>

            <Route path="limits">
              <Modal>
                <LimitsPage />
              </Modal>
            </Route>

            <Route path="add">
              <Modal>
                <AddPage />
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

  /* Mobile */
  :global(#mobile) .root {
    flex-direction: column;
    max-height: 100dvh;
  }

  :global(#mobile) main {
    margin: 0;
    border-radius: 0;
    padding: 0;
  }

  :global(#mobile) .content {
    padding-bottom: 5rem;
  }
</style>
