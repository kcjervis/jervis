import MasterData from '../data'
import Ship from './Ship'
export default class ShipType {
  constructor(public readonly remodelObject: { nextId: number; nextLevel: number }) {}
}
