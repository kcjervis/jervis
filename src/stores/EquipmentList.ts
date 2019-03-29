import { IEquipment } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import ObservableEquipment, { ObservableEquipmentStore } from './ObservableEquipment'

export default class EquipmentList implements ObservableEquipmentStore {
  @persist public id = uuid()

  @persist @observable public name = ''

  @persist('list', ObservableEquipment) @observable public equipments = observable<ObservableEquipment>([])

  @action public set = (index: number, equipment?: ObservableEquipment) => {
    if (equipment) {
      equipment.remove()
      equipment.store = this
      this.equipments[index] = equipment
    }
  }

  @action public createEquipment = (equip: IEquipment) => {
    const { masterId } = equip
    const improvement = equip.improvement.value
    this.equipments.push(ObservableEquipment.create({ masterId, improvement }, this))
  }

  @action public removeEquipment = (equip: ObservableEquipment) => {
    this.equipments.remove(equip)
  }

  public getEquipmentState = (equip: IEquipment) => {
    return this.equipments.find(equipState => equipState.asKcObject === equip)
  }

  @computed public get asKcEquipments() {
    return this.equipments.map(equip => equip.asKcObject)
  }

  public countEquipment = (masterId: number) => this.equipments.filter(equip => equip.masterId === masterId).length

  public initialize = () => {
    this.equipments.forEach(equip => equip.initialize(this))
  }
}
