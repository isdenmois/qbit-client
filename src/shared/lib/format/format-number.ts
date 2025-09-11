const formatterShort = new Intl.NumberFormat('ru', {
  maximumFractionDigits: 2,
})
const formatterMedium = new Intl.NumberFormat('ru', {
  maximumFractionDigits: 1,
})
const formatterLong = new Intl.NumberFormat('ru', {
  maximumFractionDigits: 0,
})

export function formatNumber(value: number): string {
  return formatterShort.format(value)
}

export function formatNumberUnit(value: number, unit: string): string {
  const formatter = value < 9.95 ? formatterShort : value < 99.5 ? formatterMedium : formatterLong

  return formatter.format(value) + ' ' + unit
}
