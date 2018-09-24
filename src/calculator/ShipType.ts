import MasterData from '../data'
import Ship from './ShipModel'
export default class ShipType {
  constructor(public readonly remodelObject: { nextId: number; nextLevel: number }) { }
}
