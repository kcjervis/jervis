import { IEquipmentDataObject, IShipDataObject, IFleetDataObject } from 'kc-calculator'
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

export type EquipmentStore<EquipmentType> = {
  equipments: IObservableArray<EquipmentType | undefined>
  removeEquipment: (equipment: NonNullable<EquipmentType>) => void
  set: (index: number, equipment: EquipmentType | undefined) => void
} & Store<EquipmentType>

export interface OperationStoreInterface extends Store {
  initialize: () => void
}

const swapStoreItem = <T extends StoreItem>(store0: Store<T>, index0: number, store1: Store<T>, index1: number) => {
  if (store0.get && store1.get) {
    const item0 = store0.get(index0)
    const item1 = store1.get(index1)
  }
}
