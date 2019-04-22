import { action, computed, observable } from 'mobx'

import ObservableOperation from './ObservableOperation'
import ObservableShip from './ObservableShip'
import ObservableEquipment from './ObservableEquipment'
import WorkspaceStore from './WorkspaceStore'

type WorkspaceItemType = 'Operation' | 'Ship'

type WorkspaceItemData = ObservableOperation | ObservableShip | ObservableEquipment

export type WorkspaceItemObject = { type: WorkspaceItemType; id: string }

type WorkspaceItemDao =
  | { type: 'Operation' | 'TemporaryOperation'; item: ObservableOperation }
  | { type: 'Ship'; item: ObservableShip }
  | { type: 'Equipment'; item: ObservableEquipment }

export default class WorkspaceItem {
  public id = ''

  public type: WorkspaceItemType = 'Operation'

  public store?: WorkspaceStore

  public get isActive() {
    if (this.store) {
      return this.store.activeItem === this
    }
    return false
  }

  @action public setActive = () => {
    if (this.store) {
      this.store.setActiveItem(this)
    }
  }

  @action public remove = () => {
    this.store && this.store.items.remove(this)
  }
}
