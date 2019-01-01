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
      this.isVisible = false
      throw console.error(`masterId: ${this.masterId} equipment is undefined`)
    }
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

  constructor(data: IEquipmentDataObject) {
    if (!data) {
      const non = data as ObservableEquipment
      return non
    }
    const { masterId = 1, improvement = 0, proficiency = 0 } = data
    this.masterId = masterId
    this.improvement = improvement
    this.proficiency = proficiency
  }

  @action.bound
  public remove() {
    this.isVisible = false
  }
}
