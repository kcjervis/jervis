import { IGear, IGearDataObject, ILandBasedAirCorpsDataObject, nonNullable } from "kc-calculator"
import { action, computed, observable } from "mobx"
import { persist } from "mobx-persist"
import uuid from "uuid"

import kcObjectFactory from "./kcObjectFactory"
import ObservableGear, { ObservableGearStore } from "./ObservableGear"
import { StoreItem } from "../types"
import ObservableOperation from "./ObservableOperation"

export enum LandBasedAirCorpsMode {
  Standby,
  Sortie1,
  Sortie2
}

export default class ObservableLandBasedAirCorps
  implements ILandBasedAirCorpsDataObject, ObservableGearStore, StoreItem<ObservableOperation> {
  @computed public get asKcObject() {
    const airCorps = kcObjectFactory.createLandBasedAirCorps(this)
    return airCorps
  }

  public static create = (airCorpsData: ILandBasedAirCorpsDataObject) => {
    const observableLandBasedAirCorps = new ObservableLandBasedAirCorps()
    airCorpsData.equipments.forEach(
      (gearData, index) => gearData && observableLandBasedAirCorps.createGear(index, gearData)
    )

    return observableLandBasedAirCorps
  }

  public slotCapacities = [18, 18, 18, 18]

  public store?: ObservableOperation

  @persist public id = uuid()

  @persist @observable public mode = LandBasedAirCorpsMode.Sortie2

  @persist("list", ObservableGear)
  @observable
  public equipments = observable<ObservableGear | undefined>(new Array(4))

  public get gears() {
    return this.equipments
  }

  @persist("list") @observable public slots = [18, 18, 18, 18]

  public canEquip(gear: IGear, slotIndex: number) {
    return (
      gear.is("CarrierBasedAircraft") ||
      gear.is("Seaplane") ||
      gear.is("LandBasedAircraft") ||
      gear.is("JetPoweredAircraft")
    )
  }

  @action public set = (index: number, gear?: ObservableGear) => {
    if (gear) {
      gear.remove()
      gear.store = this
    }
    this.gears[index] = gear
  }

  @action public createGear = (index: number, data: IGearDataObject) => {
    const gear = ObservableGear.create(data, this)
    this.set(index, gear)
    if (gear.asKcObject.category.isReconnaissanceAircraft) {
      this.slots[index] = 4
    } else {
      this.slots[index] = 18
    }
  }

  @action public removeGear = (gear: ObservableGear) => {
    this.gears[gear.index] = undefined
  }

  @action public setSlotSize = (index: number, value: number) => {
    if (typeof this.slots[index] === "number" && value >= 0) {
      this.slots[index] = value
    }
  }

  @action public restoreSlotSize = () => {
    this.gears.forEach((gear, index) => {
      if (!gear) {
        this.setSlotSize(index, 18)
        return
      }
      const capacity = gear.asKcObject.category.isReconnaissanceAircraft ? 4 : 18
      this.setSlotSize(index, capacity)
    })
  }

  @action public initialize = (store: ObservableOperation) => {
    this.store = store
    this.gears.forEach(gear => gear && gear.initialize(this))
  }

  private toJSON(): ILandBasedAirCorpsDataObject {
    const { slots, equipments } = this
    return { slots, equipments }
  }
}
