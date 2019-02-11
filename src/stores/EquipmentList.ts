import { IEquipment, nonNullable } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import ObservableEquipment from './ObservableEquipment'

export default class EquipmentList {
  @persist
  public id = uuid()

  @persist
  @observable
  public name: string = ''

  @persist('list', ObservableEquipment)
  @observable
  public equipments: ObservableEquipment[] = []

  @action public createEquipment = (equip: IEquipment) => {
    const { masterId } = equip
    const improvement = equip.improvement.value
    this.equipments.push(ObservableEquipment.create({ masterId, improvement }))
  }

  @action public removeEquipment = (equip: IEquipment) => {
    this.equipments.splice(this.asKcEquipments.indexOf(equip), 1)
  }

  public getEquipmentState = (equip: IEquipment) => {
    return this.equipments.find(equipState => equipState.asKcObject === equip)
  }

  @computed get asKcEquipments() {
    return this.equipments.map(equip => equip.asKcObject)
  }

  public countEquipment = (masterId: number) => this.equipments.filter(equip => equip.masterId === masterId).length
}
