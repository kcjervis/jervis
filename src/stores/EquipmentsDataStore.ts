import { IEquipment, nonNullable } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'

import EquipmentList from './EquipmentList'
import kcObjectFactory, { masterData } from './kcObjectFactory'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'
import ObservableShip from './ObservableShip'

type Mode = 'default' | 'sort' | 'setting'

export default class EquipmentsDataStore {
  @observable public parent?: ObservableShip | ObservableLandBasedAirCorps

  @observable public index?: number

  @observable public mode: Mode = 'default'

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

  get activeEquipmentList() {
    return this.equipmentLists.find(list => list.id === this.activeEquipmentListId)
  }

  get label() {
    const { parent } = this
    if (parent instanceof ObservableShip) {
      return `${parent.asKcObject.name} 選択中`
    } else if (parent instanceof ObservableLandBasedAirCorps) {
      return '基地航空隊 選択中'
    }
    return ''
  }

  @computed get equipmentsData() {
    return masterData.equipments
      .map(equip => kcObjectFactory.createEquipment({ masterId: equip.id }))
      .filter(nonNullable)
  }

  @computed get visibleEquipments() {
    const { parent, index = 0, equipmentsData, visibleAlly, visibleAbysall, mode, activeEquipmentList } = this
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

    return equipments.filter(equip => parent.canEquip(equip, index))
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

  @action public removeEquipmentList = (list: EquipmentList) => {
    const { equipmentLists } = this
    equipmentLists.splice(equipmentLists.indexOf(list), 1)
  }

  @action public setEquipment = (equipment: IEquipment) => {
    const { parent, index } = this
    if (!parent || typeof index !== 'number') {
      return false
    }
    const { category, masterId } = equipment
    let proficiency = 0
    if (category.isAerialCombatAircraft) {
      proficiency = 100
    }
    if (category.isReconnaissanceAircraft) {
      proficiency = 120
    }
    if (masterId > 500 || category.is('LandBasedReconnaissanceAircraft')) {
      proficiency = 0
    }

    parent.createEquipment(index, {
      masterId: equipment.masterId,
      proficiency,
      improvement: equipment.improvement.value
    })

    return true
  }
}
