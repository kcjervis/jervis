import { action, computed, observable } from 'mobx'

import WorkspaceItem, { WorkspaceItemObject } from './WorkspaceItem'

export default class WorkspaceStore {
  @observable public items = observable<WorkspaceItem>([])

  @observable private activeItemId?: string

  @action public setActiveItem = (item: WorkspaceItem | undefined) => {
    this.activeItemId = item && item.id
  }

  public get activeItem() {
    const { items, activeItemId } = this
    return items.find(item => item.id === activeItemId)
  }

  @action public createItem = ({ type, id }: WorkspaceItemObject) => {
    const found = this.items.find(item => item.id === id)
    if (found) {
      return found
    }
    const newItem = new WorkspaceItem()
    newItem.id = id
    newItem.type = type
    newItem.store = this
    this.items.push(newItem)
    return newItem
  }
}
