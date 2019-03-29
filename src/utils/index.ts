export * from './deckbuilder'

export const swap = <T>(array0: T[], index0: number, array1: T[], index1: number) => {
  const item0 = array0[index0]
  const item1 = array1[index1]
  array0[index0] = item1
  array1[index1] = item0
}
