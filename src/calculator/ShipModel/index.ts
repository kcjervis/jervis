import MasterData, { TShipData } from '../../data'
import EquipmentModel from '../EquipmentModel'
import Aircraft from '../EquipmentModel/Aircraft'
import Remodel from '../Remodel'

type BaseStatName = 'firepower' | 'torpedo' | 'antiAir' | 'armor' | 'asw' | 'los' | 'evasion'

export default class Ship {
  public static createShipById(masterId: number) {
    return new Ship({ masterId })
  }

  public readonly master: TShipData

  public readonly id?: number
  public readonly index?: number
  public readonly masterId: number
  public readonly sortId: number
  public readonly name: string
  public readonly shipTypeId: number
  public readonly classId: number

  public readonly isAbysall: boolean

  public slots: number[]

  public readonly equipments: EquipmentModel[]
  public readonly aircrafts: Aircraft[]

  public readonly remodel: Remodel

  public level: number
  public nowHp: number
  public maxHp: number

  constructor(shipObj: {
    id?: number
    index?: number
    masterId: number
    slots?: number[]
    equipments?: EquipmentModel[]
    changedStats?: any
  }) {
    this.id = shipObj.id
    this.index = shipObj.index
    this.masterId = shipObj.masterId
    this.master = MasterData.getShip(this.masterId)
    this.sortId = this.master.sortId
    this.name = this.master.name
    this.shipTypeId = this.master.shipTypeId
    this.classId = this.master.classId

    this.level = 99
    this.maxHp = this.master.minHp
    this.nowHp = this.master.minHp

    this.slots = shipObj.slots ? shipObj.slots : this.master.slotCapacities.concat()

    this.equipments = shipObj.equipments ? shipObj.equipments : []
    this.aircrafts = this.equipments
      .filter(equip => equip.type.aircraftType.isAircraft)
      .map(equip => new Aircraft(equip, this.slots))

    this.remodel = new Remodel(this.masterId, this.master.remodel.nextId, this.master.remodel.nextLevel)

    this.isAbysall = this.master.id > 1500
  }

  /**
   * 表示上の装備配列を取得
   * 装備が存在しないスロットはundefinedとなる
   */
  public getDisplayedEquipments() {
    // 通常スロット + 補強増設スロット1
    const length = this.slots.length + 1
    return Array.from({ length }, (_, labelIndex) => this.equipments.find(equip => equip.index === labelIndex))
  }

  public sumEquipmentStats(statName: BaseStatName) {
    return this.equipments.reduce((value, equip) => value + equip[statName], 0)
  }

  public get firepower() {
    return this.master.maxFirepower + this.sumEquipmentStats('firepower')
  }

  public get torpedo() {
    return this.master.maxTorpedo + this.sumEquipmentStats('torpedo')
  }

  public get antiAir() {
    return this.master.maxAntiAir + this.sumEquipmentStats('antiAir')
  }

  public get armor() {
    return this.master.maxArmor + this.sumEquipmentStats('armor')
  }

  public calcBaseAsw() {
    const { maxAsw, minAsw } = this.master
    return ((maxAsw - minAsw) * this.level) / 99 + minAsw
  }

  public get asw() {
    return this.calcBaseAsw() + this.sumEquipmentStats('asw')
  }

  public calcBaseLos() {
    const { maxLos, minLos } = this.master
    return ((maxLos - minLos) * this.level) / 99 + minLos
  }

  public get los() {
    return this.calcBaseLos() + this.sumEquipmentStats('los')
  }

  public calcBaseEvasion() {
    const { maxEvasion, minEvasion } = this.master
    return ((maxEvasion - minEvasion) * this.level) / 99 + minEvasion
  }

  public get evasion() {
    return this.calcBaseEvasion() + this.sumEquipmentStats('evasion')
  }

  public get range() {
    const { baseRange } = this.master
    const equipmentRanges = this.equipments.map(equipment => {
      if (!equipment) {
        return 0
      }
      return equipment.master.range
    })
    return Math.max(baseRange, ...equipmentRanges)
  }
}
