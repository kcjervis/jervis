declare module '*/margeShips' {
  import { TStatTuple } from '*/start2'
  type TMargeAbysallShips = {
    id: number
    cnum: number
    tais: TStatTuple
    houk: TStatTuple
    saku: TStatTuple
  }
  type TMargeShips = TMargeAbysallShips | {
    id: number
    taik: TStatTuple
    souk: TStatTuple
    houg: TStatTuple
    raig: TStatTuple
    tyku: TStatTuple
    tais: TStatTuple
    houk: TStatTuple
    saku: TStatTuple
    luck: TStatTuple
    leng: number
    maxeq: number[]
  }
  const margeShips: TMargeShips[]
  export default margeShips
}