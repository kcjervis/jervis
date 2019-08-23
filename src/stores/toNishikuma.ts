import { IGear, IFleet, IOperation, IShip } from 'kc-calculator'

import { DeckFleet, DeckGear, DeckShip, Nishikuma } from '../utils'

const toDeckGear = (gear: IGear): DeckGear => {
  const { masterId, improvement, proficiency } = gear
  return {
    id: masterId,
    rf: improvement.value,
    mas: proficiency.level
  }
}

const onExslot = (ship: IShip, gear: IGear) => {
  const index = ship.gears.indexOf(gear)
  return index >= ship.slots.length
}

const toDeckShip = (ship: IShip): DeckShip => {
  const { masterId, level, equipments, nakedStats } = ship
  const items: { [K in string]: DeckGear } = {}
  equipments.forEach((gear, index) => {
    if (!gear) {
      return
    }
    const key = onExslot(ship, gear) ? 'ix' : `i${index + 1}`
    items[key] = toDeckGear(gear)
  })
  return {
    id: masterId,
    lv: level,
    hp: nakedStats.hp,
    luck: nakedStats.luck,
    asw: nakedStats.asw,
    items
  }
}

const toDeckFleet = (fleet: IFleet): DeckFleet => {
  const deckFleet: { [K in string]: DeckShip } = {}
  fleet.ships.forEach((ship, index) => {
    if (ship) {
      const key = `s${index + 1}`
      deckFleet[key] = toDeckShip(ship)
    }
  })
  return deckFleet
}

const toNishikuma = (operation: IOperation, hqlv: number): Nishikuma => {
  const nishikumaObject: { [K in string]: DeckFleet } = {}
  operation.fleets.forEach((fleet, index) => {
    const key = `f${index + 1}`
    nishikumaObject[key] = toDeckFleet(fleet)
  })
  return {
    version: 4,
    hqlv,
    ...nishikumaObject
  }
}

export default toNishikuma
