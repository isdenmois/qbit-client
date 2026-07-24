import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import ConfirmDialog from './confirm-dialog.vue'

describe('ConfirmDialog', () => {
  it('does not render when closed', () => {
    // arrange
    render(ConfirmDialog, {
      props: { modelValue: false, title: 'Delete', message: 'Are you sure?' },
    })

    // act
    // nothing

    // assert
    expect(screen.queryByRole('dialog')).toBeFalsy()
  })

  it('renders title, message and slot when open', () => {
    // arrange
    render(ConfirmDialog, {
      props: { modelValue: true, title: 'Delete', message: 'Are you sure?' },
      slots: { default: '<input id="cb" type="checkbox"><label for="cb">Delete files</label>' },
    })

    // act
    // nothing

    // assert
    expect(screen.getByRole('heading', { name: 'Delete' })).toBeDefined()
    expect(screen.getByText('Are you sure?')).toBeDefined()
    expect(screen.getByRole('checkbox')).toBeDefined()
  })

  it('uses default confirm and cancel labels', () => {
    // arrange
    render(ConfirmDialog, {
      props: { modelValue: true, title: 'Delete', message: 'Are you sure?' },
    })

    // act
    // nothing

    // assert
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined()
  })

  it('renders custom labels', () => {
    // arrange
    render(ConfirmDialog, {
      props: {
        modelValue: true,
        title: 'Delete',
        message: 'Are you sure?',
        confirmLabel: 'Yes, delete',
        cancelLabel: 'No, keep',
      },
    })

    // act
    // nothing

    // assert
    expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'No, keep' })).toBeDefined()
  })

  it('emits cancel when clicking the backdrop', async () => {
    // arrange
    const { emitted } = render(ConfirmDialog, {
      props: { modelValue: true, title: 'Delete', message: 'Are you sure?' },
    })
    const backdrop = document.querySelector('.confirm-dialog-backdrop') as HTMLElement

    // act
    await fireEvent.click(backdrop)

    // assert
    expect(emitted('update:modelValue')).toEqual([[false]])
    expect(emitted('cancel')).toHaveLength(1)
    expect(emitted('confirm')).toBeUndefined()
  })

  it('emits cancel when clicking the cancel button', async () => {
    // arrange
    const { emitted } = render(ConfirmDialog, {
      props: { modelValue: true, title: 'Delete', message: 'Are you sure?' },
    })

    // act
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    // assert
    expect(emitted('update:modelValue')).toEqual([[false]])
    expect(emitted('cancel')).toHaveLength(1)
    expect(emitted('confirm')).toBeUndefined()
  })

  it('emits confirm when clicking the confirm button', async () => {
    // arrange
    const { emitted } = render(ConfirmDialog, {
      props: { modelValue: true, title: 'Delete', message: 'Are you sure?' },
    })

    // act
    await fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    // assert
    expect(emitted('update:modelValue')).toEqual([[false]])
    expect(emitted('confirm')).toHaveLength(1)
    expect(emitted('cancel')).toBeUndefined()
  })
})
