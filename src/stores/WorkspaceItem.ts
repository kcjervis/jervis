import { action, observable } from 'mobx'

import ObservableOperation from './ObservableOperation'
import ObservableShip from './ObservableShip'
import ObservableGear from './ObservableGear'
import WorkspaceStore from './WorkspaceStore'

type WorkspaceItemType = 'Operation' | 'Ship'

type WorkspaceItemData = ObservableOperation | ObservableShip | ObservableGear

export type WorkspaceItemObject = { type: WorkspaceItemType; id: string }

export default class WorkspaceItem {
  public id = ''

  public type: WorkspaceItemType = 'Operation'

  @observable public store?: WorkspaceStore

  @observable public isActive = false

  @action public setActive = () => {
    this.store && this.store.items.forEach(item => (item.isActive = false))
    this.isActive = true
  }

  @action public remove = () => {
    const items = this.store && this.store.items
    if (!items) {
      return
    }
    if (this.isActive) {
      const index = items.indexOf(this)
      const next: WorkspaceItem | undefined = items.toJS()[index + 1]
      const prev: WorkspaceItem | undefined = items.toJS()[index - 1]
      prev && prev.setActive()
      next && next.setActive()
    }
    items.remove(this)
  }
}
