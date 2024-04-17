const formatterShort = new Intl.NumberFormat('ru', {
  maximumFractionDigits: 2,
})
const formatterLong = new Intl.NumberFormat('ru', {
  maximumFractionDigits: 0,
})

export function formatNumber(value: number): string {
  return formatterShort.format(value)
}

export function formatNumberUnit(value: number, unit: string): string {
  const formatter = value < 9.95 ? formatterShort : formatterLong

  return formatter.format(value) + ' ' + unit
}
