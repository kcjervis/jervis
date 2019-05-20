import { IEquipment, nonNullable } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'

import EquipmentList from './EquipmentList'
import kcObjectFactory, { masterData } from './kcObjectFactory'
import { Store } from '../types'

type Mode = 'simple' | 'detail' | 'sort' | 'setting'

type EquipmentFilter = (equipment: IEquipment) => boolean

export default class EquipmentsDataStore implements Store {
  @observable public mode: Mode = 'simple'

  @observable public visibleAlly = true

  @observable public visibleAbysall = false

  @observable public filterName = 'all'

  @persist('list')
  @observable
  public blackList: number[] = []

  @persist('list', EquipmentList)
  @observable
  public equipmentLists: EquipmentList[] = []

  @persist
  @observable
  public activeEquipmentListId?: string

  public get activeEquipmentList() {
    return this.equipmentLists.find(list => list.id === this.activeEquipmentListId)
  }

  @computed public get equipmentsData() {
    return masterData.equipments
      .map(equip => kcObjectFactory.createEquipment({ masterId: equip.id }))
      .filter(nonNullable)
  }

  public getVisibleEquipments = (...filters: EquipmentFilter[]) => {
    const { equipmentsData, visibleAlly, visibleAbysall, mode, activeEquipmentList } = this
    const listEquipments = activeEquipmentList ? activeEquipmentList.asKcEquipments : equipmentsData
    const equipments = listEquipments.filter(({ masterId }) => {
      if (mode !== 'setting' && this.blackList.includes(masterId)) {
        return false
      }
      if (!visibleAlly && masterId <= 500) {
        return false
      }
      if (!visibleAbysall && masterId > 500) {
        return false
      }

      return true
    })

    if (!parent) {
      return equipments
    }

    return filters.reduce((prevEquips, filter) => prevEquips.filter(filter), equipments)
  }

  @action public toggleVisibleAlly = () => {
    this.visibleAlly = !this.visibleAlly
  }

  @action public toggleVisibleAbysall = () => {
    this.visibleAbysall = !this.visibleAbysall
  }

  @action public createEquipmentList = (name: string) => {
    const newList = new EquipmentList()
    newList.name = name
    this.equipmentLists.push(newList)
    return newList
  }

  @action public setEquipmentVisibility = (masterId: number, next: boolean) => {
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

  @action public setActiveEquipmentList = (list?: EquipmentList) => {
    this.activeEquipmentListId = list && list.id
  }

  @action public removeEquipmentList = (list: EquipmentList) => {
    const { equipmentLists } = this
    equipmentLists.splice(equipmentLists.indexOf(list), 1)
  }

  @action public initialize = () => {
    this.equipmentLists.forEach(list => list.initialize())
  }
}
