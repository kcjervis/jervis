import { action, computed, observable } from 'mobx'

import ObservableOperation from './ObservableOperation'
import ObservableShip from './ObservableShip'
import ObservableEquipment from './ObservableEquipment'
import WorkspaceStore from './WorkspaceStore'

type WorkspaceItemType = 'Operation' | 'Ship'

type WorkspaceItemData = ObservableOperation | ObservableShip | ObservableEquipment

export type WorkspaceItemObject = { type: WorkspaceItemType; id: string }

export default class WorkspaceItem {
  public id = ''

  public type: WorkspaceItemType = 'Operation'

  public store?: WorkspaceStore

  public isActive: boolean = false

  @action public setActive = () => {
    this.store && this.store.items.forEach(item => (item.isActive = false))
    this.isActive = true
  }

  @action public remove = () => {
    this.store && this.store.items.remove(this)
  }
}
