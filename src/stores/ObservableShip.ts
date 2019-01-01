import { IEquipmentDataObject, IShipDataObject } from 'kc-calculator'
import { action, autorun, computed, isObservableArray, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import ObservableEquipment from './ObservableEquipment'

export default class ObservableShip implements IShipDataObject {
  @computed
  get asKcObject() {
    const ship = kcObjectFactory.createShip(this)
    if (!ship) {
      this.isVisible = false
      throw console.error(`masterId: ${this.masterId} ship is undefined`)
    }
    return ship
  }

  public static create({ masterId, level, slots, equipments }: IShipDataObject) {
    const ship = new ObservableShip()
    ship.masterId = masterId
    ship.level = level
    ship.slots = slots
    ship.equipments = Array.from(Array(slots.length + 1), (_, index) => {
      const equip = equipments[index]
      return equip && new ObservableEquipment(equip)
    })
    return ship
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

  @observable
  public isVisible = true

  constructor() {
    autorun(() =>
      this.equipments.forEach((equip, index) => {
        if (equip && !equip.isVisible) {
          this.equipments[index] = undefined
        }
      })
    )
  }

  @action.bound
  public remove() {
    this.isVisible = false
  }

  @action.bound
  public createEquipment(index: number, data: IEquipmentDataObject) {
    this.equipments[index] = new ObservableEquipment(data)
  }

  @action.bound
  public setSlotSize(index: number, value: number) {
    if (typeof this.slots[index] === 'number') {
      this.slots[index] = value
    }
  }
}
