import { IGearDataObject } from "kc-calculator"
import { action, computed, observable } from "mobx"
import { persist } from "mobx-persist"
import { v4 as uuidv4 } from "uuid"

import kcObjectFactory from "./kcObjectFactory"
import { StoreItem, GearStore } from "../types"

export type ObservableGearStore = GearStore<ObservableGear | undefined>

export default class ObservableGear implements IGearDataObject, StoreItem<ObservableGearStore> {
  @computed public get asKcObject() {
    const gear = kcObjectFactory.createGear(this)
    if (!gear) {
      throw new Error(`masterId: ${this.masterId} gear is undefined`)
    }
    return gear
  }

  public static create(data: IGearDataObject, store: ObservableGearStore) {
    const gear = new ObservableGear()
    gear.initialize(store)
    const { masterId, improvement = 0, proficiency = 0 } = data
    gear.masterId = masterId
    gear.improvement = improvement
    gear.proficiency = proficiency
    return gear
  }

  public store?: ObservableGearStore

  @persist public id = uuidv4()

  @persist @observable public masterId = 0

  @persist @observable public improvement = 0

  @persist @observable public proficiency = 0

  public get index() {
    const { store } = this
    if (store) {
      return store.gears.indexOf(this)
    }
    return -1
  }

  public isValid() {
    const gear = kcObjectFactory.createGear(this)
    if (!gear) {
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
      this.store.removeGear(this)
    }
  }

  @action public initialize = (store: ObservableGearStore) => {
    this.store = store
  }

  private toJSON(): IGearDataObject {
    const { masterId, improvement, proficiency } = this
    return {
      masterId,
      improvement: improvement ? improvement : undefined,
      proficiency: proficiency ? proficiency : undefined
    }
  }
}
