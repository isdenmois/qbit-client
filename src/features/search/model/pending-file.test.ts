import { beforeEach, describe, expect, it } from 'vitest'
import { clearPendingFile, pendingFile, setPendingFile } from './pending-file'

describe('pending-file store', () => {
  const mockFile = new File(['data'], 'sample.torrent', { type: 'application/x-bittorrent' })

  beforeEach(() => {
    pendingFile.value = null
  })

  it('setPendingFile stores the file in pendingFile', () => {
    // arrange & act
    setPendingFile(mockFile)

    expect(pendingFile.value).toStrictEqual(mockFile)
  })

  it('clearPendingFile resets pendingFile to null', () => {
    // arrange
    setPendingFile(mockFile)

    // act
    clearPendingFile()

    // assert
    expect(pendingFile.value).toBeNull()
  })
})
