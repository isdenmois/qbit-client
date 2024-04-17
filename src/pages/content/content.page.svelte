<script lang="ts">
  import { api } from 'shared/api'
  import { maindata } from 'entities/stats'
  import { Icon, ModalContent, icons } from 'shared/ui'
  import { onMount } from 'svelte'
  import type { TorrentFile } from 'shared/api/torrent'

  export let id: string

  interface Node {
    name: string
    children: Array<Node | TorrentFile>
  }

  let path: string[] = []
  let tree: Node = {
    name: 'root',
    children: [],
  }

  onMount(async () => {
    const files = await api.torrent.files(id)

    files.forEach((file) => {
      const filePath = file.name.split('/')
      let node = tree

      while (filePath.length > 1) {
        const folder = filePath.shift() ?? ''
        let subnode = node.children.find((n) => n.name === folder) as Node

        if (!subnode) {
          subnode = {
            name: folder,
            children: [],
          }
          node.children.push(subnode)
        }

        node = subnode
      }

      node.children.push(file)
    })

    tree = { ...tree }
  })

  $: torrent = $maindata?.torrents[id]
  $: currentNode = path.reduce((node, name) => node.children.find((item) => item.name === name) as Node, tree)

  const goUp = () => {
    path = path.slice(0, -1)
  }

  const openFolder = (node: Node | TorrentFile) => {
    if ('children' in node) {
      path = [...path, node.name]
    }
  }
</script>

<ModalContent title={torrent?.name ?? ''}>
  <ul>
    {#if path.length > 0}
      <li>{path.join('/')}</li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <li on:click={goUp}>..</li>
    {/if}

    {#each currentNode.children as node (node.name)}
      {#if 'children' in node}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li on:click={() => openFolder(node)}>
          <Icon icon={icons.folder} />
          {node.name}
        </li>
      {:else}
        <li>
          <Icon icon={icons.file} />
          {node.name}
        </li>
      {/if}
    {/each}
  </ul>
</ModalContent>
