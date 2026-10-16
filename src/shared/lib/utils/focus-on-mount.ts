export function focusOnMount(node: unknown) {
  if (node instanceof HTMLElement) {
    node.focus()
  }
}
