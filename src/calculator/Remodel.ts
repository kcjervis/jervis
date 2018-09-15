import MasterData from '../data'
export default class Remodel {
  public readonly canRemodel: boolean
  public readonly canConvert: boolean

  constructor(public readonly currentId: number, public readonly nextId: number, public readonly nextLevel: number) {
    this.canRemodel = this.nextId > 0
    this.canConvert = false
    if (this.canRemodel) {
      const nextShipData = MasterData.getShip(nextId)
      this.canConvert = Boolean(nextId && nextShipData && currentId === nextShipData.remodel.nextId)
    }
  }
}
