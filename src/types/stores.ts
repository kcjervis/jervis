import { IObservableArray } from 'mobx'

export type Store<T = any> = {
  set?: (index: number, item: T) => void
  get?: (index: number) => T | undefined
  initialize: (...arg: any[]) => void
}

export type StoreItem<T extends Store = Store> = {
  store?: T
  initialize: (store: T) => void
}

export type GearStore<GearType> = {
  gears: IObservableArray<GearType | undefined>
  removeGear: (gear: NonNullable<GearType>) => void
  set: (index: number, gear: GearType | undefined) => void
} & Store<GearType>

export type ShipStore<ShipType> = {
  ships: IObservableArray<ShipType>
  removeShip: (ship: NonNullable<ShipType>) => void
}

export interface OperationStoreInterface extends Store {
  initialize: () => void
}

const swapStoreItem = <T extends StoreItem>(store0: Store<T>, index0: number, store1: Store<T>, index1: number) => {
  if (store0.get && store1.get) {
    const item0 = store0.get(index0)
    const item1 = store1.get(index1)
  }
}
