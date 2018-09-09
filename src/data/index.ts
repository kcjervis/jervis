import equipments from './equipments'
import shipClasses from './shipClasses'
import ships, { TShipData } from './ships'

export default class MasterData {
  public static readonly allShipIds = ships.map(({ id }) => id)
  public static readonly allEquipmentIds = equipments.map(({ id }) => id)

  public static getShipClassName(classId: number) {
    const shipClass = shipClasses.find(({ id }) => id === classId)
    return shipClass && shipClass.name
  }

  public static getShip(masterId: number) {
    return ships.find(({ id }) => id === masterId)
  }

  public static getEquipment(masterId: number) {
    return equipments.find(({ id }) => id === masterId)
  }

  public static get shipClasses() {
    return shipClasses
  }
}

export type TShipData = TShipData
