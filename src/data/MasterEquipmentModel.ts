import { TEquipmentData } from './equipments'

export default class MasterEquipmentModel {
  public readonly id: number
  public readonly sortNo: number
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
  constructor(equipData: TEquipmentData) {
    const {
      id,
      sortNo,
      name,
      typeIds,
      hp = 0,
      armor = 0,
      firepower = 0,
      torpedo = 0,
      speed = 0,
      bombing = 0,
      antiAir = 0,
      asw = 0,
      accuracy = 0,
      evasion = 0,
      los = 0,
      luck = 0,
      range = 0
    } = equipData

    this.id = id
    this.sortNo = sortNo
    this.name = name
    this.typeIds = typeIds
    this.hp = hp
    this.armor = armor
    this.firepower = firepower
    this.torpedo = torpedo
    this.speed = speed
    this.bombing = bombing
    this.antiAir = antiAir
    this.asw = asw
    this.los = los
    this.luck = luck
    this.range = range

    this.accuracy = 0
    this.evasion = 0
    this.antiBomber = 0
    this.interception = 0
    if (this.typeIds[2] === 48) {
      this.antiBomber = accuracy
      this.interception = evasion
    } else {
      this.accuracy = accuracy
      this.evasion = evasion
    }
  }
}
