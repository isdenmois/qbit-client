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

  let selected = new Set<TorrentFile>()

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

  $: getFileIcon = (node: TorrentFile) => {
    if (selected.has(node)) {
      return icons.documentCheck
    }

    if (node.priority > 1) {
      return icons.documentSpeed
    }

    return node.priority ? icons.file : icons.documentCross
  }

  const goUp = () => {
    if (selected.size) return

    path = path.slice(0, -1)
  }

  const openFolder = (node: Node | TorrentFile) => {
    if (selected.size) return

    if ('children' in node) {
      path = [...path, node.name]
    }
  }

  const selectFile = (node: TorrentFile) => {
    if (selected.has(node)) {
      selected.delete(node)
    } else {
      selected.add(node)
    }

    selected = selected
  }

  const setPriority = async (priority: number) => {
    await api.torrent.setPriority(id, [...selected], priority)

    for (const node of selected.values()) {
      node.priority = priority
    }

    selected = new Set()
  }
</script>

<ModalContent title={torrent?.name ?? ''}>
  <ul class:selection={selected.size} class="flex flex-col gap-4">
    {#if path.length > 0}
      <li>{path.join('/')}</li>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <li class="up" on:click={goUp}><Icon icon={icons.arrowUp} /> ..</li>
    {/if}

    {#each currentNode.children as node (node.name)}
      {#if 'children' in node}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li class="folder" on:click={() => openFolder(node)}>
          <Icon icon={icons.folder} />
          {node.name}
        </li>
      {:else}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li class="file" class:selected={selected.has(node)} on:click={() => selectFile(node)}>
          <Icon icon={getFileIcon(node)} />
          {node.name}
        </li>
      {/if}
    {/each}
  </ul>

  <div slot="bottom" class="flex gap-2 justify-center md:justify-start md:px-8">
    {#if selected.size}
      <button on:click={() => setPriority(0)}><Icon icon={icons.documentCross} /></button>
      <button on:click={() => setPriority(1)}><Icon icon={icons.file} /></button>
      <button on:click={() => setPriority(7)}><Icon icon={icons.documentSpeed} /></button>
    {/if}
  </div>
</ModalContent>

<style>
  li {
    display: flex;
    min-height: 2rem;
    gap: 0.5rem;
    word-break: break-word;
    user-select: none;
    cursor: pointer;
  }

  .selection li.file {
    opacity: 0.6;
  }

  .selection li.selected {
    opacity: 1;
    font-weight: bold;
  }

  .selection li.up,
  .selection li.folder {
    opacity: 0.1;
    cursor: unset;
  }
</style>
