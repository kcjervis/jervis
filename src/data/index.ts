import equipments from './equipments'
import maps from './maps'
import MasterEquipmentModel from './MasterEquipmentModel'
import shipClasses from './shipClasses'
import ships, { TShipData } from './ships'

export default class MasterData {
  public static get shipClasses() {
    return shipClasses
  }
  public static readonly allShipIds = ships.map(({ id }) => id)
  public static readonly allEquipmentIds = equipments.map(({ id }) => id)

  public static readonly Equipments = equipments.map(equip => new MasterEquipmentModel(equip))

  public static readonly Maps = maps

  public static getShipClassName(classId: number) {
    const shipClass = shipClasses.find(({ id }) => id === classId)
    return shipClass && shipClass.name
  }

  public static getShip(masterId: number) {
    const ship = ships.find(({ id }) => id === masterId)
    if (!ship) {
      throw new Error(`ship ${masterId} is not found`)
    }
    return ship
  }

  public static getEquipment(masterId: number) {
    const equip = this.Equipments.find(({ id }) => id === masterId)
    if (!equip) {
      throw new Error(`equipment ${masterId} is not found`)
    }
    return equip
  }
}

export { default as EquipmentType } from './EquipmentType'
export { TShipData, MasterEquipmentModel }
