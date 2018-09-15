import MasterData, { EquipmentType, MasterEquipmentModel } from '../data'

export interface IEquipmentObj {
  id?: number
  masterId: number
  improvement: number
  internalProficiency: number
}

export default class Equipment {
  public static createEquipmentById(masterId: number) {
    return new Equipment({ masterId, improvement: 0, internalProficiency: 0 })
  }
  public readonly id?: number
  public readonly masterId: number
  public readonly name: string

  public readonly master: MasterEquipmentModel

  public readonly improvement: number
  public readonly internalProficiency: number

  public readonly isAbysall: boolean

  public readonly type: EquipmentType

  constructor(equipmentObj: IEquipmentObj) {
    this.id = equipmentObj.id
    this.masterId = equipmentObj.masterId

    this.master = MasterData.getEquipment(this.masterId)
    this.type = new EquipmentType(this.master.typeIds)

    this.name = this.master.name
    this.improvement = equipmentObj.improvement
    this.internalProficiency = equipmentObj.internalProficiency

    this.isAbysall = this.masterId > 500
  }
}
