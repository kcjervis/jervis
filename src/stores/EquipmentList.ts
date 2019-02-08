import { IEquipment, nonNullable } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import uuid from 'uuid'

import ObservableEquipment from './ObservableEquipment'

export default class EquipmentList {
  public id = uuid()

  @observable public name: string = ''

  @observable public equipments: ObservableEquipment[] = []

  @action public setEquipment = (equip: ObservableEquipment) => {
    this.equipments.push(equip)
  }

  @computed get asKcObject() {
    return this.equipments.map(equip => equip.asKcObject)
  }
}
