const MAX_ETA = 1_000_000

export const isEtaVisible = (eta: number) => eta > 0 && eta <= MAX_ETA
