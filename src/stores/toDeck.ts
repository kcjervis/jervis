import { IGear, IFleet, IOperation, IShip, ILandBasedAirCorps } from "kc-calculator"

import { DeckFleet, DeckGear, DeckItems, DeckShip, DeckAirCorps, AirCorpsMode, Deck } from "../utils"

const toDeckGear = (gear: IGear): DeckGear => {
  const { gearId, improvement, proficiency } = gear
  return {
    id: gearId,
    rf: improvement.value,
    mas: proficiency.level
  }
}

const toItems = (gears: Array<IGear | undefined>, length: number): DeckItems => {
  const items: DeckItems = {}
  gears.forEach((gear, index) => {
    if (!gear) {
      return
    }
    const onExslot = index >= length
    const key = (onExslot ? "ix" : `i${index + 1}`) as keyof DeckItems
    items[key] = toDeckGear(gear)
  })

  return items
}

const toDeckShip = (ship: IShip): DeckShip => {
  const { masterId, level, gears, nakedStats } = ship
  const items = toItems(gears, ship.slots.length)
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

const toDeckAirCorps = (lbac: ILandBasedAirCorps): DeckAirCorps => {
  const items = toItems(lbac.gears, 4)
  return {
    mode: AirCorpsMode.Sortie,
    items
  }
}

const toDeck = (operation: IOperation, hqlv: number): Deck => {
  const deck: Deck = { version: 4, hqlv }

  operation.fleets.forEach((fleet, index) => {
    const key = `f${index + 1}` as "f1"
    deck[key] = toDeckFleet(fleet)
  })

  operation.landBase.forEach((lbac, index) => {
    const key = `a${index + 1}` as "a1"
    deck[key] = toDeckAirCorps(lbac)
  })

  return deck
}

export default toDeck
