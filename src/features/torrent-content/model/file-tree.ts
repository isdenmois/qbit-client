import { computed, onMounted, ref } from 'vue'
import { api } from '@/shared/api'
import { Priority, type TorrentFile } from '@/shared/api/torrent'
import { compare } from '@/shared/lib/utils'

export interface FolderNode {
  name: string
  priority: Priority
  progress: number
  size: number
  children: TreeNode[]
}

export type TreeNode = FolderNode | TorrentFile

export const isFolder = (node: TreeNode): node is FolderNode => 'children' in node

export interface UseFileTreeOptions {
  /** torrent hash: files are fetched from the API and priority changes are sent to the server */
  id?: string
  /** pre-known file list: the tree is built from it and priority changes stay local */
  files?: TorrentFile[]
}

const byName = compare<TreeNode>((node) => node.name.toLocaleLowerCase())

const compareNodes = (a: TreeNode, b: TreeNode) => {
  if (isFolder(a) !== isFolder(b)) {
    return isFolder(a) ? -1 : 1
  }

  return byName(a, b)
}

const sortTree = (folder: FolderNode) => {
  folder.children.sort(compareNodes)

  for (const child of folder.children) {
    if (isFolder(child)) {
      sortTree(child)
    }
  }
}

const collectFiles = (node: TreeNode, files: TorrentFile[]) => {
  if (isFolder(node)) {
    for (const child of node.children) {
      collectFiles(child, files)
    }
  } else {
    files.push(node)
  }
}

export const expandToFiles = (nodes: Iterable<TreeNode>): TorrentFile[] => {
  const files: TorrentFile[] = []

  for (const node of nodes) {
    collectFiles(node, files)
  }

  return files
}

export const updateTreePriorities = (folder: FolderNode) => {
  if (!folder.children.length) {
    return
  }

  for (const child of folder.children) {
    if (isFolder(child)) {
      updateTreePriorities(child)
    }
  }

  const [first] = folder.children
  folder.priority = folder.children.some((child) => child.priority !== first.priority)
    ? Priority.Normal
    : first.priority
}

export const updateTreeProgress = (folder: FolderNode): [number, number] => {
  let downloaded = 0
  let total = 0

  for (const child of folder.children) {
    if (isFolder(child)) {
      const [childDownloaded, childTotal] = updateTreeProgress(child)
      downloaded += childDownloaded
      total += childTotal
    } else if (child.priority !== Priority.None) {
      downloaded += child.progress * child.size
      total += child.size
    }
  }

  folder.progress = total ? downloaded / total : 1

  return [downloaded, total]
}

export const updateTreeSizes = (folder: FolderNode): number => {
  let size = 0

  for (const child of folder.children) {
    size += isFolder(child) ? updateTreeSizes(child) : child.size
  }

  folder.size = size

  return size
}

export const buildFileTree = (files: TorrentFile[]): FolderNode => {
  const root: FolderNode = { name: 'root', priority: Priority.Normal, progress: 0, size: 0, children: [] }
  const folders = new Map<string, FolderNode>([['', root]])

  for (const file of files) {
    const segments = file.name.split('/')
    const name = segments.pop() as string

    let folderPath = ''
    let node = root

    for (const segment of segments) {
      folderPath = folderPath ? `${folderPath}/${segment}` : segment
      let subnode = folders.get(folderPath)

      if (!subnode) {
        subnode = { name: segment, priority: file.priority, progress: 0, size: 0, children: [] }
        folders.set(folderPath, subnode)
        node.children.push(subnode)
      }

      node = subnode
    }

    file.name = name
    node.children.push(file)
  }

  sortTree(root)
  updateTreePriorities(root)
  updateTreeProgress(root)
  updateTreeSizes(root)

  return root
}

export const useFileTree = (options: UseFileTreeOptions) => {
  const path = ref<string[]>([])
  const tree = ref<FolderNode>({ name: 'root', priority: Priority.Normal, progress: 0, size: 0, children: [] })
  const selected = ref(new Set<TreeNode>())
  const showSizes = ref(false)

  const currentNode = computed(() =>
    path.value.reduce((node, name) => node.children.find((item) => item.name === name) as FolderNode, tree.value),
  )

  const toggleSelect = (node: TreeNode) => {
    if (selected.value.has(node)) {
      selected.value.delete(node)
    } else {
      selected.value.add(node)
    }

    selected.value = new Set(selected.value)
  }

  const goUp = () => {
    if (selected.value.size) return

    path.value = path.value.slice(0, -1)
  }

  const openFolder = (node: TreeNode) => {
    if (selected.value.size) {
      return toggleSelect(node)
    }

    if (isFolder(node)) {
      path.value = [...path.value, node.name]
    }
  }

  const setPriority = async (priority: Priority) => {
    const files = expandToFiles(selected.value)
    if (options.id) {
      await api.torrent.setPriority(options.id, files, priority)
    }

    for (const file of files) {
      file.priority = priority
    }

    updateTreePriorities(tree.value)
    updateTreeProgress(tree.value)

    selected.value = new Set()
  }

  const autoOpenSingleFolder = () => {
    const [first] = tree.value.children
    if (tree.value.children.length === 1 && isFolder(first)) {
      openFolder(first)
    }
  }

  if (options.files) {
    tree.value = buildFileTree(options.files)
    autoOpenSingleFolder()
  } else {
    onMounted(async () => {
      tree.value = buildFileTree(await api.torrent.files(options.id as string))
      autoOpenSingleFolder()
    })
  }

  return { tree, path, currentNode, selected, showSizes, goUp, openFolder, toggleSelect, setPriority }
}
