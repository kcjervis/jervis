import EquipmentModel, { Aircraft } from './EquipmentModel'
export default class LandBasedAirCorpsModel {
  public id?: number
  public index: number
  public slots: number[]
  public equipments: EquipmentModel[]
  public aircrafts: Aircraft[]
  constructor(lbacObj: { id: number; index: number; slots: number[]; equipments: EquipmentModel[] }) {
    this.id = lbacObj.id
    this.index = lbacObj.index
    this.slots = lbacObj.slots.concat()
    this.equipments = lbacObj.equipments
    this.aircrafts = this.equipments
      .filter(equip => equip.type.aircraftType.isAircraft)
      .map(equip => new Aircraft(equip, this.slots))
  }

  public getDisplayedEquipments() {
    const length = this.slots.length
    return Array.from({ length }, (_, labelIndex) => this.equipments.find(equip => equip.index === labelIndex))
  }
}
