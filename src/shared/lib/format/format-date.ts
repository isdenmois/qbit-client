/**
 * Formats a Unix timestamp into a human-readable date string.
 *
 * @param {number} timestamp - The Unix timestamp to be converted.
 * @returns {string} A human-readable date string in Russian locale format.
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('ru')
}
