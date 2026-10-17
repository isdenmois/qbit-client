const focused = new WeakSet<HTMLElement>()

export function focusOnMount(node: unknown) {
  if (node instanceof HTMLElement && !focused.has(node)) {
    focused.add(node)
    node.focus()
  }
}
