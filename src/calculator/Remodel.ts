import MasterData from '../data'
import Ship from './Ship'
export default class Remodel {
  public readonly nextId = this.ShipModel.masterShip.remodel.nextId

  public readonly nextLevel = this.ShipModel.masterShip.remodel.nextLevel

  public readonly canRemodel = this.nextId > 0

  public get canConvert() {
    const { nextId } = this
    const nextShipData = MasterData.getShip(nextId)
    return nextId && nextShipData && nextId === nextShipData.remodel.nextId
  }

  constructor(public readonly ShipModel: Ship) {}
}
