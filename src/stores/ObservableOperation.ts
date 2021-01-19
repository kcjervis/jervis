import { FleetTypeName, IOperationDataObject, Side, Formation } from "kc-calculator"
import { action, computed, observable } from "mobx"
import { persist } from "mobx-persist"
import { v4 as uuidv4 } from "uuid"
import { times } from "lodash-es"
import { DeckBuilder as GkcoiDeck } from "gkcoi"

import kcObjectFactory from "./kcObjectFactory"
import ObservableFleet from "./ObservableFleet"
import ObservableLandBasedAirCorps from "./ObservableLandBasedAirCorps"
import toDeck from "./toDeck"
import OperationStore from "./OperationStore"
import { StoreItem } from "../types"
import { GkcoiLang, GkcoiTheme, toGkcoiDeck } from "./GkcoiDeck"

type OperationData = IOperationDataObject & {
  version?: number
  id?: string
  name?: string
  hqLevel?: number
  description?: string
}

export default class ObservableOperation implements IOperationDataObject, StoreItem<OperationStore> {
  public static create = (operationData: OperationData) => {
    const observableOperation = new ObservableOperation()

    const { name, description, hqLevel } = operationData
    if (name) {
      observableOperation.name = name
    }
    if (hqLevel) {
      observableOperation.hqLevel = hqLevel
    }
    if (description) {
      observableOperation.description = description
    }
    observableOperation.side = operationData.side
    observableOperation.fleetType = operationData.fleetType

    observableOperation.fleets = observable(operationData.fleets.map(ObservableFleet.create))
    observableOperation.landBase = observable(operationData.landBase.map(ObservableLandBasedAirCorps.create))
    return observableOperation
  }

  public store?: OperationStore

  @persist public id = uuidv4()

  @persist @observable public name = ""

  @persist @observable public description = ""

  @persist @observable public hqLevel = 120

  @persist @observable public side: Side = "Player"

  @persist @observable public fleetType = FleetTypeName.Single

  @persist @observable private formationId = 0

  @persist @observable public gkcoiTheme: GkcoiTheme = "dark"

  @persist @observable public gkcoiLang: GkcoiLang = "jp"

  public get formation(): Formation {
    const res = Formation.fromId(this.formationId)
    return res || Formation.LineAhead
  }

  public setFormation = (arg: number | Formation) => {
    if (typeof arg === "number") {
      this.formationId = arg
    } else {
      this.formationId = arg.id
    }
  }

  @persist("list", ObservableFleet)
  @observable
  public fleets = observable(times(4, () => new ObservableFleet()))

  @persist("list", ObservableLandBasedAirCorps)
  @observable
  public landBase = observable(times(3, () => new ObservableLandBasedAirCorps()))

  @persist("object", ObservableOperation)
  @observable
  public enemy?: ObservableOperation

  @observable public activeFleetIndex = 0

  @action public copy = () => {
    const { store } = this
    if (store) {
      store.copyOperation(this)
    }
  }

  public get index() {
    const { store } = this
    if (!store) {
      return -1
    }
    return store.operations.indexOf(this)
  }

  @action public swap = (target: ObservableOperation) => {
    const { store } = this
    const targetStore = target.store
    if (!store || !targetStore) {
      return
    }
    const index = this.index
    const targetIndex = target.index
    store.set(index, target)
    targetStore.set(targetIndex, this)
  }

  @action public remove = () => {
    const { store } = this
    if (store) {
      store.operations.remove(this)
    }
  }

  public get lbIndex() {
    return this.fleets.length
  }

  public get gkcoiIndex() {
    return this.lbIndex + 1
  }

  public get activeFleet() {
    const { fleets, activeFleetIndex } = this
    if (fleets.length > activeFleetIndex) {
      return fleets[activeFleetIndex]
    }
    return undefined
  }

  @computed public get asKcObject() {
    const obj = kcObjectFactory.createOperation(this)
    return obj
  }

  public toGkcoiDeck = () => {
    return toGkcoiDeck(this)
  }

  public toDeckJson = (full = true) => {
    const deck = toDeck(this.asKcObject, this.hqLevel)
    const str = JSON.stringify(deck)

    if (full || encodeURIComponent(str).length < 8000) {
      return str
    }

    delete deck.f3
    delete deck.f4
    return JSON.stringify(deck)
  }

  @action public initialize = (store: OperationStore) => {
    this.store = store
    this.fleets.forEach(fleet => fleet.initialize(this))
    this.landBase.forEach(airCorps => airCorps.initialize(this))
  }

  private toJSON(): OperationData {
    const { id, name, description, hqLevel, side, fleetType, fleets, landBase } = this
    const version = 1
    return { version, id, name, description, hqLevel, side, fleetType, fleets, landBase }
  }
}
