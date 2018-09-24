import ShipModel from './ShipModel'
export default class FleetModel {
  public id?: number
  public index?: number
  public ships: ShipModel[]
  constructor(fleetObj: { id: number; index: number; ships: ShipModel[] }) {
    this.id = fleetObj.id
    this.index = fleetObj.index
    this.ships = fleetObj.ships
  }

  public getDisplayedShips = () => {
    return Array.from({ length: 6 }, (_, displayedIndex) => this.ships.find(ship => ship.index === displayedIndex))
  }

  public getAircrafts() {
    const aircrafts = []
    for (const ship of this.ships) {
      if (ship.nowHp <= 0) {
        continue
      }
      aircrafts.push(...ship.aircrafts)
    }
    return aircrafts
  }

  public calculateFighterPower() {
    let fighterPower = 0
    for (const ship of this.ships) {
      for (const aircraft of ship.aircrafts) {
        const { isFighter, isDiveBomber, isTorpedoBomber } = aircraft.aircraftType
        if (isFighter || isDiveBomber || isTorpedoBomber) {
          fighterPower += aircraft.calculateFighterPower()
        }
      }
    }
    return fighterPower
  }
}
