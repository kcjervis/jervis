import MasterData, { TShipData } from '../data'
import EquipmentModel, { IEquipmentObj } from './Equipment'
import Remodel from './Remodel'

type BaseStatName = 'firepower' | 'torpedo' | 'antiAir' | 'armor' | 'asw' | 'los' | 'evasion'

export default class Ship {
  public static createShipById(masterId: number) {
    return new Ship({ masterId })
  }

  public readonly master: TShipData

  public readonly id?: number
  public readonly masterId: number
  public readonly sortId: number
  public readonly name: string
  public readonly shipTypeId: number
  public readonly classId: number

  public readonly isAbysall: boolean

  public slots: number[]

  public readonly equipments: Array<EquipmentModel | null>

  public readonly remodel: Remodel

  public level: number
  public nowHp: number
  public maxHp: number

  constructor(shipObj: {
    id?: number
    masterId: number
    slots?: number[]
    equipments?: IEquipmentObj[]
    changedStats?: any
  }) {
    this.id = shipObj.id
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

    this.equipments = []
    if (shipObj.equipments) {
      this.equipments = shipObj.equipments.map(equipObj => {
        if (!equipObj) {
          return null
        }
        return new EquipmentModel(equipObj)
      })
    }

    this.remodel = new Remodel(this.masterId, this.master.remodel.nextId, this.master.remodel.nextLevel)

    this.isAbysall = this.master.id > 1500
  }

  public sumEquipmentStats(statName: BaseStatName) {
    return this.equipments.reduce((value, equip) => {
      if (!equip) {
        return value
      }
      return value + equip.master[statName]
    }, 0)
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
