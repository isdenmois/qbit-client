import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { filters, query } from '../model'
import NameFilter from './name-filter.vue'

const renderFilter = () =>
  render(NameFilter, {
    slots: { default: '<h1>Completed (2)</h1>' },
  })

describe('NameFilter', () => {
  beforeEach(() => {
    filters.value = { ratio: 'off', uploading: false, category: '', query: '' }
  })

  it('renders the heading slot without an input until search opens', () => {
    // act
    const { getByText, queryByRole } = renderFilter()

    // assert
    expect(getByText('Completed (2)')).toBeTruthy()
    expect(queryByRole('textbox', { name: 'Filter completed torrents by name' })).toBeNull()
  })

  it('swaps the search icon for a cross while the filter is open', async () => {
    // arrange
    const { getByRole } = renderFilter()
    const button = getByRole('button', { name: 'Search completed torrents' })
    const href = () => button.querySelector('use')?.getAttribute('xlink:href')

    // assert
    expect(href()).toContain('search.svg')

    // act
    await fireEvent.click(button)

    // assert
    expect(href()).toContain('cross.svg')

    // act
    await fireEvent.click(button)

    // assert
    expect(href()).toContain('search.svg')
  })

  it('opens the input, focuses it and binds the query', async () => {
    // arrange
    const { getByRole } = renderFilter()

    // act
    await fireEvent.click(getByRole('button', { name: 'Search completed torrents' }))

    // assert
    const input = getByRole('textbox', { name: 'Filter completed torrents by name' })
    expect(document.activeElement).toBe(input)

    // act
    await fireEvent.update(input, 'download')

    // assert
    expect(query.value).toBe('download')
  })

  it('closes on the search button and clears the query', async () => {
    // arrange
    const { getByRole, queryByRole } = renderFilter()
    await fireEvent.click(getByRole('button', { name: 'Search completed torrents' }))
    await fireEvent.update(getByRole('textbox', { name: 'Filter completed torrents by name' }), 'download')

    // act
    await fireEvent.click(getByRole('button', { name: 'Search completed torrents' }))

    // assert
    expect(queryByRole('textbox', { name: 'Filter completed torrents by name' })).toBeNull()
    expect(query.value).toBe('')
  })

  it('closes on escape and clears the query', async () => {
    // arrange
    const { getByRole, queryByRole } = renderFilter()
    await fireEvent.click(getByRole('button', { name: 'Search completed torrents' }))
    const input = getByRole('textbox', { name: 'Filter completed torrents by name' })
    await fireEvent.update(input, 'download')

    // act
    await fireEvent.keyDown(input, { key: 'Escape' })

    // assert
    expect(queryByRole('textbox', { name: 'Filter completed torrents by name' })).toBeNull()
    expect(query.value).toBe('')
  })
})
