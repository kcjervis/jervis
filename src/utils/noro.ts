import { IOperation, ILandBasedAirCorps, IPlane, IShip, isNonNullable } from "kc-calculator"

/*
  プリセットメモ
  全体: [0:id, 1:名前, 2:基地プリセット, 3:艦隊プリセット, 4:敵艦プリセット, 5:メモ]
  基地: [0:機体群, 1:札群]
  艦隊: [0: id, 1: plane配列, 2: 配属位置]
  機体: [0:id, 1:熟練, 2:改修値, 3:搭載数, 4:スロット位置]
  敵艦: [0:戦闘位置, 1:enemyId配列(※ 直接入力時は負値で制空値), 2:マスid]
*/

type NoroPlane = [number, number, number, number, number]
type NoroLandBase = [NoroPlane[], [number, number, number]]
type NoroShip = [number, NoroPlane[], number]

const encordPlane = ({ gear, slotSize, index }: IPlane): NoroPlane => [
  gear.gearId,
  gear.proficiency.level,
  gear.star,
  slotSize,
  index
]

const encordLbac = (lbac: ILandBasedAirCorps, rootIndex: number): NoroPlane[] =>
  lbac.planes.map(({ gear, slotSize, index }) => [
    gear.gearId,
    gear.proficiency.level,
    gear.star,
    slotSize,
    index + rootIndex * 4
  ])

const encordLandBase = (landBase: ILandBasedAirCorps[]) => {
  const planes = landBase.flatMap(encordLbac)
  return [planes, [2, 2, 2]]
}
const encordShip = (ship: IShip | undefined, index: number): NoroShip | undefined =>
  ship && [ship.shipId, ship.planes.map(encordPlane), index]

export const createNoroLandBase = (operation: IOperation) => JSON.stringify(encordLandBase(operation.landBase))
