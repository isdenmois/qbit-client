export const compare = <T>(fn: (object: T) => string | number | boolean) => {
  return (a: T, b: T) => {
    const x = fn(a)
    const y = fn(b)

    if (x < y) {
      return -1
    }

    if (x > y) {
      return 1
    }

    return 0
  }
}
