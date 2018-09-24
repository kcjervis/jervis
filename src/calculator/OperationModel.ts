import FleetModel from './FleetModel'
import LandBasedAriCorpsModel from './LandBasedAirCorpsModel'

export default class OperationModel {
  public id?: number
  public index: number
  public fleets: FleetModel[]
  public landBase: LandBasedAriCorpsModel[]
  constructor(operationObj: { id: number; index: number; fleets: FleetModel[]; landBase: LandBasedAriCorpsModel[] }) {
    this.id = operationObj.id
    this.index = operationObj.index
    this.fleets = operationObj.fleets
    this.landBase = operationObj.landBase
  }

  public getCombinedFleet() {
    return {
      mainFleet: this.fleets[0],
      escortFleet: this.fleets[1]
    }
  }
}
