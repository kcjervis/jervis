import flatMap from 'lodash/flatMap'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'

import ObservableEquipment from './ObservableEquipment'
import ObservableFleet from './ObservableFleet'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'
import ObservableOperation from './ObservableOperation'
import ObservableShip from './ObservableShip'
import { setDeckbuilder } from '../utils'
import { Store } from '../types'

const switchArrayItems = <T>(array1: T[], index1: number, array2: T[], index2: number) => {
  const item1 = array1[index1]
  const item2 = array2[index2]
  array1[index1] = item2
  array2[index2] = item1
}

interface DraggableEquipmentProps {
  parent: ObservableShip | ObservableLandBasedAirCorps
  index: number
}

interface DraggableShipProps {
  fleet: ObservableFleet
  index: number
}

export default class OperationStore implements Store<ObservableOperation> {
  @persist('list', ObservableOperation) @observable public operations = observable<ObservableOperation>([])

  @computed public get fleets() {
    return flatMap(this.operations, operation => operation.fleets)
  }

  @computed public get ships() {
    return flatMap(this.fleets, ({ ships }) => ships).filter(
      (ship): ship is ObservableShip => ship instanceof ObservableShip
    )
  }

  @computed public get equipments() {
    return flatMap(this.ships, ({ equipments }) => equipments).filter(
      (equip): equip is ObservableEquipment => equip instanceof ObservableEquipment
    )
  }

  @action public createOperation = (name = `編成${this.operations.length + 1}`) => {
    const newOperation = new ObservableOperation()
    newOperation.store = this
    newOperation.name = name
    this.operations.push(newOperation)
    return newOperation
  }

  @action public set = (index: number, operation: ObservableOperation) => {
    this.operations[index] = operation
    operation.store = this
  }

  @action public push = (operation: ObservableOperation) => {
    operation.remove()
    this.operations.push(operation)
    operation.store = this
  }

  @action public fromNishikuma = (json: string, name?: string) => {
    const deckObject = JSON.parse(json.replace(/^http:\/\/kancolle-calc\.net\/deckbuilder\.html\?predeck=/, ''))
    const newOperation = this.createOperation(name)
    return setDeckbuilder(newOperation, deckObject)
  }

  @action public copyOperation = (operation: ObservableOperation) => {
    const newOperation = ObservableOperation.create(operation)
    newOperation.store = this
    newOperation.name = `${operation.name}のコピー`
    this.operations.push(newOperation)
    return newOperation
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

  @action public initialize = () => {
    this.operations.forEach(operation => operation.initialize(this))
  }
}
