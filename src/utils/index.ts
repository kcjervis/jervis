export * from "./deckbuilder"
export * from "./noro"
export * from "./JSONCrush"

export const swap = <T>(array0: T[], index0: number, array1: T[], index1: number) => {
  const item0 = array0[index0]
  const item1 = array1[index1]
  array0[index0] = item1
  array1[index1] = item0
}

export const toPercent = (value: number, fractionDigits = 1) => (value * 100).toFixed(fractionDigits) + "%"

export const loadImageSrc = (path: string): string | undefined => {
  try {
    return require(`../images/${path}`)
  } catch {
    console.warn(`Cannot find: ${path}`)
    return
  }
}
