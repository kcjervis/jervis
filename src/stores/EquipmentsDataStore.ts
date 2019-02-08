import { IEquipment, nonNullable } from 'kc-calculator'
import { action, computed, observable } from 'mobx'

import EquipmentList from './EquipmentList'
import kcObjectFactory, { masterData } from './kcObjectFactory'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'
import ObservableShip from './ObservableShip'

type Mode = undefined | 'sort' | 'setting'

export default class EquipmentsDataStore {
  @observable public parent?: ObservableShip | ObservableLandBasedAirCorps

  @observable public index?: number

  @observable public mode?: Mode

  @observable public visibleAlly = true

  @observable public visibleAbysall = false

  @observable public filterName = 'all'

  @observable public blackList: number[] = []

  @observable public equipmentLists: EquipmentList[] = []

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
    const { parent, index = 0, equipmentsData, visibleAlly, visibleAbysall, mode } = this
    const equipments = equipmentsData.filter(({ masterId }) => {
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

    if (parent instanceof ObservableShip) {
      return equipments.filter(equip => parent.asKcObject.canEquip(equip, index))
    } else if (parent instanceof ObservableLandBasedAirCorps) {
      return equipments.filter(
        ({ category }) =>
          category.isCarrierBasedAircraft ||
          category.isSeaplane ||
          category.isLandBasedAircraft ||
          category.isJetPoweredAircraft
      )
    }
    return equipments
  }

  @action public setMode = (arg: Mode | ((mode: Mode) => Mode)) => {
    if (typeof arg === 'function') {
      this.mode = arg(this.mode)
    } else {
      this.mode = arg
    }
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
