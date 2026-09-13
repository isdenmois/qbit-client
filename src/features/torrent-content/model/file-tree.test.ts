import { describe, expect, it } from 'vitest'
import { Priority, type TorrentFile } from '@/shared/api/torrent'
import { buildFileTree, expandToFiles, type FolderNode, isFolder, updateTreePriorities } from './file-tree'

const file = (index: number, name: string, priority: Priority, progress: number, size: number): TorrentFile => ({
  index,
  name,
  priority,
  progress,
  size,
})

describe('file-tree', () => {
  describe('buildFileTree', () => {
    it('builds a nested tree from a flat file list', () => {
      // arrange
      const files = [
        file(0, 'folder/file1.txt', Priority.Normal, 0, 100),
        file(1, 'folder/sub/deep.txt', Priority.Normal, 0, 300),
        file(2, 'other/file3.txt', Priority.Normal, 0, 400),
        file(3, 'root.txt', Priority.Normal, 0, 50),
      ]

      // act
      const tree = buildFileTree(files)

      // assert: folders before files, case-insensitive order, leaf names without paths
      expect(tree.children.map((node) => node.name)).toStrictEqual(['folder', 'other', 'root.txt'])

      const folder = tree.children[0] as FolderNode
      expect(folder.children.map((node) => node.name)).toStrictEqual(['sub', 'file1.txt'])
    })

    it('unifies folder priority when children differ', () => {
      // arrange
      const files = [
        file(0, 'mixed/a.txt', Priority.Normal, 1, 100),
        file(1, 'mixed/b.txt', Priority.Maximum, 1, 100),
        file(2, 'max/a.txt', Priority.Maximum, 1, 100),
        file(3, 'max/b.txt', Priority.Maximum, 1, 100),
      ]

      // act
      const tree = buildFileTree(files)

      // assert: children are sorted 'max' before 'mixed' (case-insensitive)
      const mixed = tree.children.find((node) => node.name === 'mixed') as FolderNode
      const max = tree.children.find((node) => node.name === 'max') as FolderNode
      expect(mixed.priority).toBe(Priority.Normal)
      expect(max.priority).toBe(Priority.Maximum)
    })

    it('computes size-weighted progress excluding skipped files', () => {
      // arrange: (0.5 * 100 + 1 * 300) / 400 = 87.5%, skipped file adds nothing
      const files = [
        file(0, 'folder/small.txt', Priority.Normal, 0.5, 100),
        file(1, 'folder/skipped.txt', Priority.None, 0, 999),
        file(2, 'folder/big.txt', Priority.Normal, 1, 300),
      ]

      // act
      const tree = buildFileTree(files)

      // assert
      const [folder] = tree.children as FolderNode[]
      expect(folder.progress).toBeCloseTo(0.875)
    })

    it('marks fully skipped folders as complete to hide percent', () => {
      // arrange
      const files = [file(0, 'folder/skipped.txt', Priority.None, 0, 100)]

      // act
      const tree = buildFileTree(files)

      // assert
      const [folder] = tree.children as FolderNode[]
      expect(folder.progress).toBe(1)
    })

    it('aggregates folder sizes including skipped files', () => {
      // arrange
      const files = [
        file(0, 'folder/sub/deep.txt', Priority.Normal, 0, 300),
        file(1, 'folder/skipped.txt', Priority.None, 0, 999),
        file(2, 'folder/a.txt', Priority.Normal, 0, 100),
        file(3, 'root.txt', Priority.Normal, 0, 50),
      ]

      // act
      const tree = buildFileTree(files)

      // assert: nested sums include the skipped file
      const folder = tree.children.find((node) => node.name === 'folder') as FolderNode
      const sub = folder.children.find((node) => node.name === 'sub') as FolderNode
      expect(sub.size).toBe(300)
      expect(folder.size).toBe(1399)
      expect(tree.size).toBe(1449)
    })
  })

  describe('expandToFiles', () => {
    it('expands folders to descendant files recursively', () => {
      // arrange
      const tree = buildFileTree([
        file(0, 'folder/a.txt', Priority.Normal, 0, 1),
        file(1, 'folder/sub/b.txt', Priority.Normal, 0, 2),
        file(2, 'root.txt', Priority.Normal, 0, 3),
      ])
      const [folder, rootFile] = tree.children

      // act
      const files = expandToFiles([folder, rootFile])

      // assert: 'sub' folder comes before 'a.txt', so b.txt is collected first
      expect(files.map((node) => node.index)).toStrictEqual([1, 0, 2])
    })
  })

  describe('updateTreePriorities', () => {
    it('propagates priority changes up through nested folders', () => {
      // arrange: outer holds a deep file and a direct file, both maximum
      const tree = buildFileTree([
        file(0, 'outer/inner/a.txt', Priority.Maximum, 1, 1),
        file(1, 'outer/b.txt', Priority.Maximum, 1, 1),
      ])
      const [outer] = tree.children as FolderNode[]
      const [inner] = outer.children as FolderNode[]
      const innerFile = inner.children[0]

      // act: skip the deep file and recompute
      innerFile.priority = Priority.None
      updateTreePriorities(tree)

      // assert: inner uniform → None, outer mixed → Normal
      expect(inner.priority).toBe(Priority.None)
      expect(outer.priority).toBe(Priority.Normal)
    })
  })

  describe('isFolder', () => {
    it('distinguishes folders from files', () => {
      // arrange
      const tree = buildFileTree([file(0, 'a.txt', Priority.Normal, 0, 1)])

      // act & assert
      expect(isFolder(tree)).toBe(true)
      expect(isFolder(tree.children[0])).toBe(false)
    })
  })
})
