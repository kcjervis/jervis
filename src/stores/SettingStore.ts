import { observable } from 'mobx'
import { persist } from 'mobx-persist'

export default class SettingStore {
  @persist('object')
  @observable
  public operationPage = {
    visibleShipStats: true
  }
}