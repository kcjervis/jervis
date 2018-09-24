import MasterData, { MasterEquipmentModel } from '../../data'
import EquipmentType from './EquipmentType'

export interface IEquipmentObj {
  id?: number
  index: number
  masterId: number
  improvement: number
  internalProficiency: number
}
export default class EquipmentModel {
  public static createEquipmentById(masterId: number) {
    return new EquipmentModel({ masterId, index: 0, improvement: 0, internalProficiency: 0 })
  }
  public readonly id?: number
  public readonly index: number
  public readonly masterId: number

  public readonly master: MasterEquipmentModel

  public readonly name: string
  public readonly typeIds: Readonly<number[]>
  public readonly hp: number
  public readonly armor: number
  public readonly firepower: number
  public readonly torpedo: number
  public readonly speed: number
  public readonly bombing: number
  public readonly antiAir: number
  public readonly asw: number
  public readonly los: number
  public readonly luck: number
  public readonly range: number
  public readonly accuracy: number
  public readonly antiBomber: number
  public readonly evasion: number
  public readonly interception: number

  public readonly improvement: number
  public readonly internalProficiency: number

  public readonly isAbysall: boolean

  public readonly type: EquipmentType

  constructor(equipmentObj: IEquipmentObj) {
    this.id = equipmentObj.id
    this.index = equipmentObj.index
    this.masterId = equipmentObj.masterId

    const master = MasterData.getEquipment(this.masterId)
    this.master = master

    this.name = master.name
    this.typeIds = master.typeIds
    this.type = new EquipmentType(this.typeIds)

    this.hp = master.hp
    this.armor = master.armor
    this.firepower = master.firepower
    this.torpedo = master.torpedo
    this.speed = master.speed
    this.bombing = master.bombing
    this.antiAir = master.antiAir
    this.asw = master.asw
    this.los = master.los
    this.luck = master.luck
    this.range = master.range
    this.accuracy = master.accuracy
    this.antiBomber = master.antiBomber
    this.evasion = master.evasion
    this.interception = master.interception

    this.improvement = equipmentObj.improvement
    this.internalProficiency = equipmentObj.internalProficiency

    this.isAbysall = this.masterId > 500
  }
}
