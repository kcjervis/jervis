import flatMap from 'lodash/flatMap'
import { action, autorun, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'

import fromNishikuma from './fromNishikuma'
import ObservableEquipment from './ObservableEquipment'
import ObservableFleet from './ObservableFleet'
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
  fleet: ObservableFleet
  index: number
}

export default class OperationStore {
  get activeOperation() {
    const { activeOperationId, temporaryOperation } = this
    if (temporaryOperation) {
      return temporaryOperation
    }
    if (activeOperationId) {
      return this.getOperation(activeOperationId)
    }
    return undefined
  }

  @observable public temporaryOperation?: ObservableOperation

  @persist('list', ObservableOperation)
  @observable
  public operations: ObservableOperation[] = []

  @persist
  @observable
  private activeOperationId = ''

  constructor() {
    autorun(() => {
      this.operations.forEach(({ isVisible }, index) => {
        if (!isVisible) {
          this.operations.splice(index, 1)
        }
      })
    })
  }

  @action public setActiveOperation = (operation: ObservableOperation) => {
    this.temporaryOperation = undefined
    this.activeOperationId = operation.id
  }

  @computed get allOperations() {
    const operations = Array.from(this.operations)
    if (this.temporaryOperation) {
      operations.push(this.temporaryOperation)
    }
    return operations
  }

  @computed
  get fleets() {
    return flatMap(this.allOperations, operation => operation.fleets)
  }

  @computed
  get ships() {
    return flatMap(this.fleets, ({ ships }) => ships).filter(
      (ship): ship is ObservableShip => ship instanceof ObservableShip
    )
  }

  @computed
  get equipments() {
    return flatMap(this.ships, ({ equipments }) => equipments).filter(
      (equip): equip is ObservableEquipment => equip instanceof ObservableEquipment
    )
  }

  @action public createOperation = () => {
    const newOperation = new ObservableOperation()
    this.operations.push(newOperation)
    return newOperation
  }

  @action public copyOperation = (operation: ObservableOperation) => {
    const newOperation = ObservableOperation.create(operation)
    newOperation.name = `${operation.name}のコピー`
    this.operations.push(newOperation)
    return newOperation
  }

  @action.bound
  public fromNishikuma(json: string) {
    const operation = fromNishikuma(JSON.parse(json))
    if (operation) {
      this.operations.push(operation)
      return operation
    }
    return undefined
  }

  @action.bound
  public switchEquipment(dragProps: IDraggableEquipmentProps, dropProps: IDraggableEquipmentProps) {
    const dragParent = dragProps.parent
    const dropParent = dropProps.parent
    const equip1 = dragParent.equipments[dragProps.index]
    const equip2 = dropParent.equipments[dropProps.index]
    dragParent.setEquipment(dragProps.index, equip2)
    dropParent.setEquipment(dropProps.index, equip1)
    if (dragParent instanceof ObservableLandBasedAirCorps) {
      switchArrayItems(dragParent.slots, dragProps.index, dropParent.slots, dropProps.index)
    }
  }

  @action.bound
  public switchShip(dragProps: IDraggableShipProps, dropProps: IDraggableShipProps) {
    const dragFleet = dragProps.fleet
    const dropFleet = dropProps.fleet
    if (dragFleet && dropFleet) {
      const { ships: ships1 } = dragFleet
      const { ships: ships2 } = dropFleet
      switchArrayItems(ships1, dragProps.index, ships2, dropProps.index)
    }
  }

  public getOperation = (id: string) => {
    return this.allOperations.find(operation => operation.id === id)
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
