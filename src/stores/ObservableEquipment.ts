import { IEquipmentDataObject } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import { StoreItem, EquipmentStore } from '../types'

export type ObservableEquipmentStore = EquipmentStore<ObservableEquipment | undefined>

export default class ObservableEquipment implements IEquipmentDataObject, StoreItem<ObservableEquipmentStore> {
  @computed public get asKcObject() {
    const equip = kcObjectFactory.createEquipment(this)
    if (!equip) {
      throw new Error(`masterId: ${this.masterId} equipment is undefined`)
    }
    return equip
  }

  public static create(data: IEquipmentDataObject, store: ObservableEquipmentStore) {
    const equip = new ObservableEquipment()
    equip.initialize(store)
    const { masterId, improvement = 0, proficiency = 0 } = data
    equip.masterId = masterId
    equip.improvement = improvement
    equip.proficiency = proficiency
    return equip
  }

  public store?: ObservableEquipmentStore

  @persist public id = uuid()

  @persist @observable public masterId = 0

  @persist @observable public improvement = 0

  @persist @observable public proficiency = 0

  public get index() {
    const { store } = this
    if (store) {
      return store.equipments.indexOf(this)
    }
    return -1
  }

  public isValid() {
    const equip = kcObjectFactory.createEquipment(this)
    if (!equip) {
      this.remove()
      return false
    }
    return true
  }

  @action public changeImprovement = (value: number) => {
    this.improvement = value
  }

  @action public changeProficiency = (value: number) => {
    this.proficiency = value
  }

  @action public remove = () => {
    if (this.store) {
      this.store.removeEquipment(this)
    }
  }

  @action public initialize = (store: ObservableEquipmentStore) => {
    this.store = store
  }

  private toJSON(): IEquipmentDataObject {
    const { masterId, improvement, proficiency } = this
    return {
      masterId,
      improvement: improvement ? improvement : undefined,
      proficiency: proficiency ? proficiency : undefined
    }
  }
}
