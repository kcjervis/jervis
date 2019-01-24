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
      if (!equip || equip.masterId <= 0) {
        return undefined
      }
      return ObservableEquipment.create(equip)
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

  @persist('object')
  @observable
  public increased: NonNullable<IShipDataObject['increased']> = {}

  @observable
  public isVisible = true

  @observable
  public visibleEquipments = true

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
}
