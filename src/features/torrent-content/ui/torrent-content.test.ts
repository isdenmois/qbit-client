import { fireEvent, render, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/shared/api'
import { Priority, type TorrentFile } from '@/shared/api/torrent'
import TorrentContent from './torrent-content.vue'

const createFiles = () => [
  { index: 0, name: 'folder/file1.txt', priority: 1, progress: 0, size: 100 },
  { index: 1, name: 'folder/file2.txt', priority: 7, progress: 0, size: 200 },
  { index: 2, name: 'folder/sub/deep.txt', priority: 0, progress: 0, size: 300 },
  { index: 3, name: 'other/file3.txt', priority: 0, progress: 0, size: 400 },
]

vi.spyOn(api.torrent, 'files').mockImplementation(() => Promise.resolve(createFiles()))
vi.spyOn(api.torrent, 'setPriority').mockResolvedValue('')

describe('TorrentContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a tree from flat file list', async () => {
    // act
    const { getByText } = render(TorrentContent, { props: { id: 'abc' } })

    // assert
    await waitFor(() => {
      expect(getByText('folder')).toBeTruthy()
      expect(getByText('other')).toBeTruthy()
    })
  })

  it('renders the title prop', () => {
    // arrange
    const files = createFiles()

    // act
    const { getByText } = render(TorrentContent, { props: { files, title: 'Test Torrent' } })

    // assert
    expect(getByText('Test Torrent')).toBeTruthy()
  })

  it('selects a folder with a right-click', async () => {
    // act
    const { getByText, container } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))
    const row = container.querySelector('li.folder')
    await fireEvent.contextMenu(row as Element)

    // assert
    expect(row?.classList.contains('selected')).toBe(true)
  })

  it('toggles folder selection with right-click while selecting', async () => {
    // act
    const { getByText, container } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))
    const row = container.querySelector('li.folder')
    await fireEvent.contextMenu(row as Element)
    await fireEvent.contextMenu(row as Element)

    // assert
    expect(row?.classList.contains('selected')).toBe(false)
  })

  it('keeps navigation locked while a folder is selected', async () => {
    // act
    const { getByText, queryByText, container } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))
    const row = container.querySelector('li.folder')
    await fireEvent.contextMenu(row as Element)
    await fireEvent.click(getByText('folder'))

    // assert
    await waitFor(() => {
      expect(queryByText('file1.txt')).toBeFalsy()
    })
  })

  it('expands selected folder recursively when setting priority', async () => {
    // act
    const { getByText, getByRole } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))
    await fireEvent.contextMenu(getByText('folder'))

    await fireEvent.click(getByRole('button', { name: 'Set maximum priority' }))

    // assert: recursive expansion sends all descendant indexes, not siblings
    await waitFor(() => {
      expect(api.torrent.setPriority).toHaveBeenCalledWith(
        'abc',
        expect.arrayContaining([
          expect.objectContaining({ index: 0 }),
          expect.objectContaining({ index: 1 }),
          expect.objectContaining({ index: 2 }),
        ]),
        7,
      )
      expect(api.torrent.setPriority).not.toHaveBeenCalledWith(
        'abc',
        expect.arrayContaining([expect.objectContaining({ index: 3 })]),
        7,
      )
    })
  })

  it('applies priority to descendant files and clears selection', async () => {
    // act
    const { getByText, getByRole, queryByText, queryByRole } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))
    await fireEvent.contextMenu(getByText('folder'))
    await fireEvent.click(getByRole('button', { name: 'Set maximum priority' }))

    await fireEvent.click(getByText('folder'))
    await waitFor(() => getByText('sub'))
    await fireEvent.click(getByText('sub'))
    await waitFor(() => getByText('deep.txt'))

    // assert: priority set on the descendant file node, selection cleared (no bottom bar)
    await waitFor(() => {
      expect(queryByText('deep.txt')).toBeTruthy()
      expect(api.torrent.setPriority).toHaveBeenCalledTimes(1)
    })
    expect(queryByRole('button', { name: 'Set maximum priority' })).toBeNull()
  })

  it('unlocks navigation after toggling the folder off', async () => {
    // act
    const { getByText, container } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))
    const row = container.querySelector('li.folder')
    await fireEvent.contextMenu(row as Element)
    await fireEvent.contextMenu(row as Element)
    await fireEvent.click(getByText('folder'))

    // assert
    await waitFor(() => {
      expect(getByText('file1.txt')).toBeTruthy()
    })
  })

  it('navigates into a folder and back', async () => {
    // act
    const { getByText, queryByText } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))
    await fireEvent.click(getByText('folder'))

    // assert
    await waitFor(() => {
      expect(getByText('file1.txt')).toBeTruthy()
      expect(getByText('file2.txt')).toBeTruthy()
      expect(queryByText('other')).toBeFalsy()
    })

    // act
    await fireEvent.click(getByText('..'))

    // assert
    await waitFor(() => expect(getByText('other')).toBeTruthy())
  })

  it('sets priority on selected files', async () => {
    // act
    const { getByText, getByRole } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))
    await fireEvent.click(getByText('folder'))
    await waitFor(() => getByText('file1.txt'))
    await fireEvent.click(getByText('file1.txt'))

    await fireEvent.click(getByRole('button', { name: 'Set maximum priority' }))

    // assert
    await waitFor(() => {
      expect(api.torrent.setPriority).toHaveBeenCalledWith(
        'abc',
        expect.arrayContaining([expect.objectContaining({ index: 0 })]),
        7,
      )
    })
  })

  it('builds the tree from provided files without fetching', () => {
    // arrange
    const files = createFiles()

    // act
    const { getByText } = render(TorrentContent, { props: { files } })

    // assert
    expect(getByText('folder')).toBeTruthy()
    expect(getByText('other')).toBeTruthy()
    expect(api.torrent.files).not.toHaveBeenCalled()
  })

  it('keeps priority changes local when files are provided', async () => {
    // arrange
    const files: TorrentFile[] = createFiles()

    // act
    const { getByText, getByRole } = render(TorrentContent, { props: { files } })

    await fireEvent.contextMenu(getByText('folder'))
    await fireEvent.click(getByRole('button', { name: 'Skip file' }))

    // assert: tree nodes are mutated in place, no API call
    expect(api.torrent.setPriority).not.toHaveBeenCalled()
    expect(files.find((file) => file.index === 0)?.priority).toBe(Priority.None)
    expect(files.find((file) => file.index === 1)?.priority).toBe(Priority.None)
    expect(files.find((file) => file.index === 2)?.priority).toBe(Priority.None)
    expect(files.find((file) => file.index === 3)?.priority).toBe(Priority.None)
  })

  it('hides sizes by default', async () => {
    // act
    const { getByText, queryByText } = render(TorrentContent, { props: { id: 'abc' } })

    // assert
    await waitFor(() => expect(getByText('folder')).toBeTruthy())
    expect(queryByText('600 B')).toBeFalsy()
  })

  it('shows file and folder sizes after enabling the toggle', async () => {
    // arrange
    const { getByText, getByRole } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))

    // act
    await fireEvent.click(getByRole('button', { name: 'Show sizes' }))

    // assert: folder aggregates its descendants, files keep their own size
    expect(getByText('600 B')).toBeTruthy()
    expect(getByText('400 B')).toBeTruthy()

    await fireEvent.click(getByText('folder'))
    await waitFor(() => {
      expect(getByText('file1.txt')).toBeTruthy()
      expect(getByText('100 B')).toBeTruthy()
    })
  })

  it('hides percent for skipped files', async () => {
    // arrange
    const { getByText, queryByText } = render(TorrentContent, { props: { id: 'abc' } })

    await waitFor(() => getByText('folder'))
    await fireEvent.click(getByText('folder'))

    // act
    await fireEvent.click(getByText('sub'))

    // assert
    expect(getByText('deep.txt')).toBeTruthy()
    expect(queryByText('0%')).toBeFalsy()
  })

  it('shows size-weighted percent on folders', async () => {
    // arrange
    vi.mocked(api.torrent.files).mockImplementationOnce(() =>
      Promise.resolve([
        { index: 0, name: 'folder/small.txt', priority: 1, progress: 0.5, size: 100 },
        { index: 1, name: 'folder/big.txt', priority: 1, progress: 1, size: 300 },
        { index: 2, name: 'root.txt', priority: 1, progress: 1, size: 100 },
      ]),
    )

    // act
    const { getByText } = render(TorrentContent, { props: { id: 'abc' } })

    // assert: (0.5 * 100 + 1 * 300) / 400 = 87.5%
    await waitFor(() => {
      expect(getByText('folder')).toBeTruthy()
      expect(getByText('87,5%')).toBeTruthy()
    })
  })

  it('hides percent for fully skipped folders', async () => {
    // arrange
    vi.mocked(api.torrent.files).mockImplementationOnce(() =>
      Promise.resolve([
        { index: 0, name: 'folder/skipped.txt', priority: 0, progress: 0, size: 100 },
        { index: 1, name: 'root.txt', priority: 0, progress: 0, size: 100 },
      ]),
    )

    // act
    const { getByText, queryByText } = render(TorrentContent, { props: { id: 'abc' } })

    // assert
    await waitFor(() => expect(getByText('folder')).toBeTruthy())
    expect(queryByText('0%')).toBeFalsy()
  })

  it('recomputes folder percent after skipping a file', async () => {
    // arrange
    vi.mocked(api.torrent.files).mockImplementationOnce(() =>
      Promise.resolve([
        { index: 0, name: 'folder/done.txt', priority: 1, progress: 1, size: 100 },
        { index: 1, name: 'folder/todo.txt', priority: 1, progress: 0, size: 100 },
        { index: 2, name: 'root.txt', priority: 1, progress: 1, size: 100 },
      ]),
    )
    const { getByText, queryByText, getByRole } = render(TorrentContent, { props: { id: 'abc' } })

    // assert: (1 * 100 + 0 * 100) / 200 = 50%
    await waitFor(() => expect(getByText('50%')).toBeTruthy())

    // act: skip the completed file
    await fireEvent.click(getByText('folder'))
    await waitFor(() => getByText('done.txt'))
    await fireEvent.click(getByText('done.txt'))
    await fireEvent.click(getByRole('button', { name: 'Skip file' }))
    await fireEvent.click(getByText('..'))

    // assert: only the unfinished file counts now
    await waitFor(() => {
      expect(getByText('0%')).toBeTruthy()
      expect(queryByText('50%')).toBeFalsy()
    })
  })

  it('hides percent when showProgress is false', async () => {
    // arrange
    vi.mocked(api.torrent.files).mockImplementationOnce(() =>
      Promise.resolve([
        { index: 0, name: 'folder/pending.txt', priority: 1, progress: 0, size: 100 },
        { index: 1, name: 'root.txt', priority: 1, progress: 0, size: 100 },
      ]),
    )

    // act
    const { getByText, queryByText } = render(TorrentContent, { props: { id: 'abc', showProgress: false } })

    // assert
    await waitFor(() => expect(getByText('folder')).toBeTruthy())
    expect(queryByText('0%')).toBeFalsy()
  })
})
