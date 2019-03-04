import { IEquipment, IEquipmentDataObject, IShipDataObject, shipStatKeys } from 'kc-calculator'
import { action, autorun, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import ObservableEquipment from './ObservableEquipment'

export default class ObservableShip implements IShipDataObject {
  @computed
  public get asKcObject() {
    const ship = kcObjectFactory.createShip(this)
    if (!ship) {
      this.isVisible = false
      throw console.error(`masterId: ${this.masterId} ship is undefined`)
    }
    return ship
  }

  public static create({ masterId, level, slots, equipments, nowHp, increased }: IShipDataObject) {
    const observableShip = new ObservableShip()
    observableShip.masterId = masterId
    observableShip.level = level
    observableShip.slots = slots
    observableShip.equipments = Array.from(Array(slots.length + 1), (_, index) => {
      const equip = equipments[index]
      if (!equip || equip.masterId <= 0) {
        return undefined
      }
      return ObservableEquipment.create(equip)
    })
    if (increased) {
      observableShip.increased = increased
    }

    if (typeof nowHp === 'number') {
      observableShip.nowHp = nowHp
    } else {
      observableShip.nowHp = observableShip.asKcObject.health.maxHp
    }

    return observableShip
  }

  @persist
  public id = uuid()

  @persist
  @observable
  public masterId: number = 30

  @persist
  @observable
  public level: number = 0

  @persist('list', ObservableEquipment)
  @observable
  public equipments: Array<ObservableEquipment | undefined> = []

  @persist('list')
  @observable
  public slots: number[] = []

  @persist
  @observable
  public nowHp: number = -1

  @persist('object')
  @observable
  public increased: NonNullable<IShipDataObject['increased']> = {}

  @observable
  public isVisible = true

  @observable
  public visibleEquipments = true

  public constructor() {
    autorun(() => {
      if (this.nowHp < 0) {
        this.nowHp = this.asKcObject.health.maxHp
      }
      this.equipments.forEach((equip, index) => {
        if (equip && !equip.isVisible) {
          this.equipments[index] = undefined
        }
      })
    })
  }

  public canEquip(equipment: IEquipment, slotIndex: number) {
    return this.asKcObject.canEquip(equipment, slotIndex)
  }

  @action.bound
  public remove() {
    this.isVisible = false
  }

  @action public setEquipment = (index: number, equipment?: ObservableEquipment) => {
    this.equipments[index] = equipment
    if (!equipment) {
      return
    }
    if (!this.asKcObject.shipClass.is('NisshinClass') || !equipment.asKcObject.category.is('LargeFlyingBoat')) {
      return
    }
    if (this.slots[index] > 0) {
      this.setSlotSize(index, 1)
    }
  }

  @action public createEquipment = (index: number, data: IEquipmentDataObject) => {
    this.setEquipment(index, ObservableEquipment.create(data))
  }

  @action public setSlotSize = (index: number, value: number) => {
    if (typeof this.slots[index] === 'number') {
      this.slots[index] = value
    }
  }

  private toJSON(): IShipDataObject {
    const { masterId, level, slots, equipments, nowHp, increased } = this
    const dataObject: IShipDataObject = { masterId, level, slots, equipments }
    if (nowHp !== this.asKcObject.health.maxHp) {
      dataObject.nowHp = nowHp
    }

    shipStatKeys.forEach(statKey => {
      if (increased[statKey] === 0) {
        delete increased[statKey]
      }
    })
    if (Object.keys(increased).length > 0) {
      dataObject.increased = increased
    }
    return dataObject
  }
}
