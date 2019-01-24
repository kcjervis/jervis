import { IEquipmentDataObject } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'

export default class ObservableEquipment implements IEquipmentDataObject {
  @computed
  get asKcObject() {
    const equip = kcObjectFactory.createEquipment(this)
    if (!equip) {
      throw new Error(`masterId: ${this.masterId} equipment is undefined`)
    }
    return equip
  }
  public static create(data: IEquipmentDataObject) {
    const equip = new ObservableEquipment()
    const { masterId, improvement = 0, proficiency = 0 } = data
    equip.masterId = masterId
    equip.improvement = improvement
    equip.proficiency = proficiency
    return equip
  }

  @persist
  public id = uuid()

  @persist
  @observable
  public masterId: number = 0

  @persist
  @observable
  public improvement: number = 0

  @persist
  @observable
  public proficiency: number = 0

  @observable
  public isVisible = true

  public isValid() {
    const equip = kcObjectFactory.createEquipment(this)
    if (!equip) {
      this.remove()
      return false
    }
    return true
  }

  @action.bound
  public remove() {
    this.isVisible = false
  }
}
