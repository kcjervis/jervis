import MasterData from '../data'

export default class Equipment {
  public static createEquipmentById(masterId: number) {
    return new Equipment({ masterId, improvement: 0, internalProficiency: 0 })
  }
  public readonly id?: number
  public readonly masterId: number
  public readonly name: string
  public readonly types: Readonly<number[]>
  public readonly hp: number
  public readonly armor: number
  public readonly firepower: number
  public readonly torpedo: number
  public readonly speed: number
  public readonly bombing: number
  public readonly antiAir: number
  public readonly asw: number
  public readonly accuracy: number
  public readonly evasion: number
  public readonly los: number
  public readonly luck: number
  public readonly range: number

  public readonly improvement: number
  public readonly internalProficiency: number

  public readonly categoryId: number
  public readonly iconId: number

  public readonly isAbysall: boolean

  constructor(equipmentObj: { id?: number; masterId: number; improvement: number; internalProficiency: number }) {
    this.id = equipmentObj.id

    const masterEquipment = MasterData.getEquipment(equipmentObj.masterId)
    if (!masterEquipment) {
      throw new Error('master equipment is undefined')
    }
    this.masterId = masterEquipment.id
    this.name = masterEquipment.name
    this.types = masterEquipment.types
    this.hp = masterEquipment.hp
    this.armor = masterEquipment.armor
    this.firepower = masterEquipment.firepower
    this.torpedo = masterEquipment.torpedo
    this.speed = masterEquipment.speed
    this.bombing = masterEquipment.bombing
    this.antiAir = masterEquipment.antiAir
    this.asw = masterEquipment.asw
    this.accuracy = masterEquipment.accuracy
    this.evasion = masterEquipment.evasion
    this.los = masterEquipment.los
    this.luck = masterEquipment.luck
    this.range = masterEquipment.range

    this.improvement = equipmentObj.improvement
    this.internalProficiency = equipmentObj.internalProficiency

    this.categoryId = this.types[2]
    this.iconId = this.types[3]
    this.isAbysall = this.masterId > 500
  }
}
