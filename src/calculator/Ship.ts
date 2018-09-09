import MasterData, { TShipData } from '../data'
import Remodel from './Remodel'

export default class Ship {
  public static createShipById(masterId: number) {
    return new Ship({ masterId })
  }

  public readonly masterShip: TShipData

  public readonly id?: number
  public readonly masterId: number
  public readonly sortNo: number
  public readonly sortId: number
  public readonly name: string
  public readonly readingName: string
  public readonly shipTypeId: number
  public readonly classId: number
  public readonly classNo: number

  public readonly isAbysall: boolean

  public slots: number[]

  public readonly remodel: Remodel

  constructor(ShipObj: { id?: number; masterId: number; slots?: number[]; changedStats?: any }) {
    this.id = ShipObj.id
    const masterShip = MasterData.getShip(ShipObj.masterId)
    if (!masterShip) {
      throw new Error('master ship is null')
    }
    this.masterShip = masterShip

    this.masterId = masterShip.id
    this.sortNo = masterShip.sortNo
    this.sortId = masterShip.sortId
    this.name = masterShip.name
    this.readingName = masterShip.readingName
    this.shipTypeId = masterShip.shipTypeId
    this.classId = masterShip.classId
    this.classNo = masterShip.classNo

    this.slots = ShipObj.slots ? ShipObj.slots : masterShip.slotCapacities.concat()

    this.remodel = new Remodel(this)

    this.isAbysall = masterShip.id > 1500
  }

  public shipTypeIs(typeName: string) {
    return this.masterShip.shipTypeId
  }
}
