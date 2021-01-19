import { ObservableOperation } from "."

import { DeckBuilder as GkcoiDeck, DeckBuilderFleet, DeckBuilderShip } from "gkcoi"
import { toItems } from "./toDeck"
import { IFleet, IShip } from "kc-calculator"
export type GkcoiTheme = GkcoiDeck["theme"]
export type GkcoiLang = GkcoiDeck["lang"]

type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

const shipToDeckShip = (ship: IShip): DeckBuilderShip => {
  const items = toItems(ship.gears, ship.slots.length)

  return {
    id: ship.shipId,
    lv: ship.level,
    items,
    hp: ship.health.maxHp,
    fp: ship.stats.firepower,
    tp: ship.stats.torpedo,
    aa: ship.stats.antiAir,
    ar: ship.stats.armor,
    asw: ship.stats.asw,
    ev: ship.stats.evasion,
    los: ship.stats.los,
    luck: ship.stats.luck
  }
}

const fleetToDeck = (fleet: IFleet): DeckBuilderFleet => {
  const deck: Partial<Record<string, DeckBuilderShip>> = {}

  fleet.ships.forEach((ship, index) => {
    deck[`s${index + 1}`] = ship && shipToDeckShip(ship)
  })

  return deck as DeckBuilderFleet
}

export const toGkcoiDeck = (operation: ObservableOperation) => {
  const { gkcoiTheme, gkcoiLang, hqLevel } = operation
  const kc = operation.asKcObject

  const deck = { hqlv: hqLevel, theme: gkcoiTheme, lang: gkcoiLang } as Mutable<GkcoiDeck>

  kc.fleets.forEach((fleet, index) => {
    if (!fleet.nonNullableShips.length) return
    deck[`f${index + 1}` as "f1"] = fleetToDeck(fleet)
  })

  kc.landBase.forEach((lb, index) => {
    if (!lb.planes.length) return
    deck[`a${index + 1}` as "a1"] = { items: toItems(lb.gears, lb.slots.length) }
  })

  return deck
}
