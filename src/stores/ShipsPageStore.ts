import { IShipDataObject } from 'kc-calculator'
import { action, observable } from 'mobx'
import ObservableFleet from './ObservableFleet'

export default class ShipsPageStore {
  @observable
  public fleet?: ObservableFleet

  @action.bound
  public createShip(index: number, data: IShipDataObject) {
    const { fleet } = this
    if (fleet && index) {
      fleet.createShip(index, data)
      this.fleet = undefined
    }
  }
}
