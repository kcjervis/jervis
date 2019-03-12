declare module '*maps' {
  export type TEventDifficulty = 1 | 2 | 3 | 4
  export type TEnemyFleet = Readonly<{
    ships: number[]
    formation: string
    difficulty?: TEventDifficulty
  }>
  export type TCellData = Readonly<{
    point: string
    enemies?: TEnemyFleet[]
  }>
  export type TMapData = Readonly<{
    mapId: number
    cells: TCellData[]
  }>
  const maps: TMapData[]
  export default maps
}
