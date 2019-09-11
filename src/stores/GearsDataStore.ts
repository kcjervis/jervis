import { IGear, nonNullable } from "kc-calculator"
import { action, computed, observable } from "mobx"
import { persist } from "mobx-persist"

import GearList from "./GearList"
import kcObjectFactory, { masterData } from "./kcObjectFactory"
import { Store } from "../types"

type Mode = "simple" | "detail" | "sort" | "setting"

type GearFilter = (gear: IGear) => boolean

export default class GearsDataStore implements Store {
  @observable public mode: Mode = "simple"

  @observable public visibleAlly = true

  @observable public visibleAbysall = false

  @observable public filterName = "all"

  @persist("list")
  @observable
  public blackList: number[] = []

  @persist("list", GearList)
  @observable
  public gearLists: GearList[] = []

  @persist
  @observable
  public activeGearListId?: string

  public get activeGearList() {
    return this.gearLists.find(list => list.id === this.activeGearListId)
  }

  @computed public get gearsData() {
    return masterData.gears
      .map(gear => kcObjectFactory.createGear({ masterId: gear.id }))
      .filter(nonNullable)
      .filter(gear => gear.name !== "")
  }

  public getVisibleGears = (...filters: GearFilter[]) => {
    const { gearsData, visibleAlly, visibleAbysall, mode, activeGearList } = this
    const listGears = activeGearList ? activeGearList.asKcObject : gearsData
    const gears = listGears.filter(gear => {
      if (mode !== "setting" && this.blackList.includes(gear.gearId)) {
        return false
      }
      const isAbyssal = gear.is("Abyssal")
      if (!visibleAlly && !isAbyssal) {
        return false
      }
      if (!visibleAbysall && isAbyssal) {
        return false
      }

      return true
    })

    if (!parent) {
      return gears
    }

    return filters.reduce((prevEquips, filter) => prevEquips.filter(filter), gears)
  }

  @action public toggleVisibleAlly = () => {
    this.visibleAlly = !this.visibleAlly
  }

  @action public toggleVisibleAbysall = () => {
    this.visibleAbysall = !this.visibleAbysall
  }

  @action public createGearList = (name: string) => {
    const newList = new GearList()
    newList.name = name
    this.gearLists.push(newList)
    return newList
  }

  @action public setGearVisibility = (masterId: number, next: boolean) => {
    const { blackList } = this
    const current = !blackList.includes(masterId)
    if (next === current) {
      return
    }
    if (current) {
      blackList.push(masterId)
    } else {
      blackList.splice(blackList.indexOf(masterId), 1)
    }
  }

  @action public setActiveGearList = (list?: GearList) => {
    this.activeGearListId = list && list.id
  }

  @action public removeGearList = (list: GearList) => {
    const { gearLists } = this
    gearLists.splice(gearLists.indexOf(list), 1)
  }

  @action public initialize = () => {
    this.gearLists.forEach(list => list.initialize())
  }
}
