import { IGear } from "kc-calculator"
import { action, computed, observable } from "mobx"
import { persist } from "mobx-persist"
import { v4 as uuidv4 } from "uuid"

import ObservableGear, { ObservableGearStore } from "./ObservableGear"

export default class GearList implements ObservableGearStore {
  @persist public id = uuidv4()

  @persist @observable public name = ""

  @persist("list", ObservableGear) @observable public equipments = observable<ObservableGear>([])

  public get gears() {
    return this.equipments
  }

  @action public set = (index: number, gear?: ObservableGear) => {
    if (gear) {
      gear.remove()
      gear.store = this
      this.gears[index] = gear
    }
  }

  @action public createGear = (gear: IGear) => {
    const { gearId } = gear
    const improvement = gear.improvement.value
    this.gears.push(ObservableGear.create({ masterId: gearId, improvement }, this))
  }

  @action public removeGear = (gear: ObservableGear) => this.gears.remove(gear)

  public getGearState = (gear: IGear) => {
    return this.gears.find(gearState => gearState.asKcObject === gear)
  }

  @computed public get asKcObject() {
    return this.gears.map(gear => gear.asKcObject)
  }

  public countGear = (masterId: number) => this.gears.filter(gear => gear.masterId === masterId).length

  public initialize = () => {
    this.gears.forEach(gear => gear.initialize(this))
  }
}
