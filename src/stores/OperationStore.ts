import { action, autorun, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'

import fromNishikuma from './fromNishikuma'
import ObservableEquipment from './ObservableEquipment'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'
import ObservableOperation from './ObservableOperation'
import ObservableShip from './ObservableShip'

const switchArrayItems = <T>(array1: T[], index1: number, array2: T[], index2: number) => {
  const item1 = array1[index1]
  const item2 = array2[index2]
  array1[index1] = item2
  array2[index2] = item1
}

interface IDraggableEquipmentProps {
  parent: ObservableShip | ObservableLandBasedAirCorps
  index: number
}

interface IDraggableShipProps {
  fleetId: string
  index: number
}

export default class OperationStore {
  @persist('list', ObservableOperation)
  @observable
  public operations: ObservableOperation[] = []

  @observable
  public visibleOperation?: ObservableOperation

  constructor() {
    autorun(() => {
      this.operations.forEach(({ isVisible }, index) => {
        if (!isVisible) {
          this.operations.splice(index, 1)
        }
      })
    })
  }

  @action.bound
  public createOperation() {
    this.operations.push(new ObservableOperation())
  }

  @action.bound
  public fromNishikuma(json: string) {
    const operation = fromNishikuma(JSON.parse(json))
    if (operation) {
      this.operations.push(operation)
    }
  }

  @action.bound
  public switchEquipment(dragProps: IDraggableEquipmentProps, dropProps: IDraggableEquipmentProps) {
    const dragParent = dragProps.parent
    const dropParent = dropProps.parent
    switchArrayItems(dragParent.equipments, dragProps.index, dropParent.equipments, dropProps.index)
    if (dragParent instanceof ObservableLandBasedAirCorps) {
      switchArrayItems(dragParent.slots, dragProps.index, dropParent.slots, dropProps.index)
    }
  }

  @action.bound
  public switchShip(dragProps: IDraggableShipProps, dropProps: IDraggableShipProps) {
    const dragFleet = this.getFleet(dragProps.fleetId)
    const dropFleet = this.getFleet(dropProps.fleetId)
    if (dragFleet && dropFleet) {
      const { ships: ships1 } = dragFleet
      const { ships: ships2 } = dropFleet
      switchArrayItems(ships1, dragProps.index, ships2, dropProps.index)
    }
  }

  @computed
  get fleets() {
    return this.operations.map(({ fleets }) => fleets).flat()
  }

  @computed
  get ships() {
    return this.fleets
      .flatMap(({ ships }) => ships)
      .filter((ship): ship is ObservableShip => ship instanceof ObservableShip)
  }

  @computed
  get equipments() {
    return this.ships
      .flatMap(({ equipments }) => equipments)
      .filter((equip): equip is ObservableEquipment => equip instanceof ObservableEquipment)
  }

  public getOperation = (id: string) => {
    return this.operations.find(operation => operation.id === id)
  }

  public getLandBasedAirCorps = (id: string) => {
    for (const { landBase } of this.operations) {
      const found = landBase.find(airCorps => airCorps.id === id)
      if (found) {
        return found
      }
    }
    return
  }

  public getFleet = (id: string) => {
    return this.fleets.find(fleet => fleet.id === id)
  }

  public getShip = (id: string) => {
    return this.ships.find(ship => ship.id === id)
  }
}
