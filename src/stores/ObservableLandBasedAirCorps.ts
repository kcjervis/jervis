import { IEquipmentDataObject, ILandBasedAirCorpsDataObject } from 'kc-calculator'
import { action, autorun, computed, observable, reaction } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import ObservableEquipment from './ObservableEquipment'

export enum LandBasedAirCorpsMode {
  Standby,
  Sortie1,
  Sortie2
}

export default class ObservableLandBasedAirCorps implements ILandBasedAirCorpsDataObject {
  get asKcObject() {
    const airCorps = kcObjectFactory.createLandBasedAirCorps(this)
    return airCorps
  }

  @persist
  public id = uuid()

  @persist
  @observable
  public mode = LandBasedAirCorpsMode.Sortie2

  @persist('list', ObservableEquipment)
  @observable
  public equipments: Array<ObservableEquipment | undefined> = new Array(4)

  @persist('list')
  @observable
  public slots = [18, 18, 18, 18]

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
  public createEquipment(index: number, data: IEquipmentDataObject) {
    const equip = new ObservableEquipment(data)
    this.equipments[index] = equip
    if (equip.asKcObject.category.isReconnaissanceAircraft) {
      this.slots[index] = 4
    } else {
      this.slots[index] = 18
    }
  }

  @action.bound
  public setSlotSize(index: number, value: number) {
    if (typeof this.slots[index] === 'number') {
      this.slots[index] = value
    }
  }
}