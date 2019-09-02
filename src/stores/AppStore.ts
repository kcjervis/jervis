import { action, observable } from "mobx"

export default class AppStore {
  @observable public isReady = false
  @action public setIsReady = (value: boolean) => (this.isReady = value)
}
