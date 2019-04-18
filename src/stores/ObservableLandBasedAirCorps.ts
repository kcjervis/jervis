import { IEquipment, IEquipmentDataObject, ILandBasedAirCorpsDataObject } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import ObservableEquipment, { ObservableEquipmentStore } from './ObservableEquipment'
import { StoreItem } from '../types'
import ObservableOperation from './ObservableOperation'

export enum LandBasedAirCorpsMode {
  Standby,
  Sortie1,
  Sortie2
}

export default class ObservableLandBasedAirCorps
  implements ILandBasedAirCorpsDataObject, ObservableEquipmentStore, StoreItem<ObservableOperation> {
  @computed public get asKcObject() {
    const airCorps = kcObjectFactory.createLandBasedAirCorps(this)
    return airCorps
  }
  public static create = (airCorpsData: ILandBasedAirCorpsDataObject) => {
    const observableLandBasedAirCorps = new ObservableLandBasedAirCorps()
    airCorpsData.equipments.forEach(
      (equipData, index) => equipData && observableLandBasedAirCorps.createEquipment(index, equipData)
    )

    return observableLandBasedAirCorps
  }

  public store?: ObservableOperation

  @persist public id = uuid()

  @persist @observable public mode = LandBasedAirCorpsMode.Sortie2

  @persist('list', ObservableEquipment)
  @observable
  public equipments = observable<ObservableEquipment | undefined>(new Array(4))

  @persist('list') @observable public slots = [18, 18, 18, 18]

  public canEquip({ category }: IEquipment, slotIndex: number) {
    return (
      category.isCarrierBasedAircraft ||
      category.isSeaplane ||
      category.isLandBasedAircraft ||
      category.isJetPoweredAircraft
    )
  }

  @action public set = (index: number, equipment?: ObservableEquipment) => {
    if (equipment) {
      equipment.remove()
      equipment.store = this
    }
    this.equipments[index] = equipment
  }

  @action public createEquipment = (index: number, data: IEquipmentDataObject) => {
    const equip = ObservableEquipment.create(data, this)
    this.set(index, equip)
    if (equip.asKcObject.category.isReconnaissanceAircraft) {
      this.slots[index] = 4
    } else {
      this.slots[index] = 18
    }
  }

  @action public removeEquipment = (equip: ObservableEquipment) => {
    const { equipments } = this
    equipments[equipments.indexOf(equip)] = undefined
  }

  @action.bound
  public setSlotSize(index: number, value: number) {
    if (typeof this.slots[index] === 'number' && value >= 0) {
      this.slots[index] = value
    }
  }

  @action public initialize = (store: ObservableOperation) => {
    this.store = store
    this.equipments.forEach(equip => equip && equip.initialize(this))
  }

  private toJSON(): ILandBasedAirCorpsDataObject {
    const { slots, equipments } = this
    return { slots, equipments }
  }
}
