export function sanitize(str: string) {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  }

  const reg = /[&<>"']/gi

  return str.replace(reg, (match) => map[match])
}
