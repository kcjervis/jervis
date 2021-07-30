import { IGearDataObject, IShipDataObject, Proficiency, formulas } from "kc-calculator"
import { DeckBuilderItem } from "gkcoi"

import { masterData } from "../stores/kcObjectFactory"
import { ObservableOperation } from "../stores"
import { LandBasedAirCorpsMode } from "../stores/ObservableLandBasedAirCorps"

const { calcHpAtLevel, calcStatAtLevel } = formulas

export type DeckGear = DeckBuilderItem

const toGearDataObject = (item: DeckGear | undefined): IGearDataObject | undefined => {
  if (!item || !item.id) {
    return undefined
  }

  const proficiency = Proficiency.internalBounds[Number(item.mas)]
  const improvement = typeof item.rf === "undefined" ? undefined : Number(item.rf)
  return {
    masterId: item.id,
    improvement,
    proficiency
  }
}

export type DeckItems = Partial<{
  i1: DeckGear
  i2: DeckGear
  i3: DeckGear
  i4: DeckGear
  i5: DeckGear
  ix: DeckGear
}>

const toGears = (items: DeckItems, length = 0) => {
  const gears = Array<IGearDataObject | undefined>(length)
  Object.entries(items).forEach(([key, item]) => {
    const index = Number(key.replace("i", ""))
    if (!isNaN(index)) {
      gears[index - 1] = toGearDataObject(item)
    }
  })

  if ("ix" in items) {
    const { ix } = items
    gears.push(toGearDataObject(ix))
  }

  return gears
}

export interface DeckShip {
  id: string | number | null
  lv: number
  luck?: number
  hp?: number
  asw?: number
  items: DeckItems
}

const toShipDataObject = (deckShip: DeckShip | undefined): IShipDataObject | undefined => {
  if (!deckShip || !deckShip.id) {
    return undefined
  }
  const { items, lv, hp, luck, asw } = deckShip
  const shipId = Number(deckShip.id)
  const masterShip = masterData.findMasterShip(shipId)
  if (!masterShip) {
    return undefined
  }

  const gears = toGears(items)

  const increased: { hp?: number; luck?: number; asw?: number } = {}
  if (hp) {
    increased.hp = hp - calcHpAtLevel(masterShip.hp, lv)
  }
  if (luck && luck > 0) {
    increased.luck = luck - masterShip.luck[0]
  }
  if (asw) {
    increased.asw = asw - calcStatAtLevel(masterShip.asw, lv)
  }

  const slots = masterShip.slotCapacities.concat()

  return {
    masterId: shipId,
    level: lv,
    equipments: gears,
    slots,
    increased
  }
}

export type DeckFleet = Partial<{
  s1: DeckShip
  s2: DeckShip
  s3: DeckShip
  s4: DeckShip
  s5: DeckShip
  s6: DeckShip
  s7: DeckShip
}>

export enum AirCorpsMode {
  Standby,
  Sortie,
  AirDefense,
  Retreat,
  Rest
}

export type DeckAirCorps = {
  mode?: AirCorpsMode
  items: DeckItems
}

export interface Deck {
  version: number
  lang?: "ja" | "en" | "ko" | "scn" | "tcn"
  theme?: "dark"
  hqlv?: number
  f1?: DeckFleet
  f2?: DeckFleet
  f3?: DeckFleet
  f4?: DeckFleet
  a1?: DeckAirCorps
  a2?: DeckAirCorps
  a3?: DeckAirCorps
}

export const setDeckbuilder = (operation: ObservableOperation, { hqlv = 120, f1, f2, f3, f4, a1, a2, a3 }: Deck) => {
  operation.hqLevel = hqlv
  ;[f1, f2, f3, f4].forEach((deckFleet, fleetIndex) => {
    if (!deckFleet) {
      return
    }

    const fleet = operation.fleets[fleetIndex]
    Object.entries(deckFleet).forEach(([shipKey, deckShip]) => {
      const shipIndex = Number(shipKey.replace("s", ""))
      if (isNaN(shipIndex)) {
        return
      }
      const shipData = toShipDataObject(deckShip)
      if (shipData) {
        fleet.createShip(shipIndex - 1, shipData)
      }
    })
  })
  ;[a1, a2, a3].forEach((deckAirCorps, acIndex) => {
    if (!deckAirCorps) {
      return
    }

    const lbac = operation.landBase[acIndex]
    const { items, mode } = deckAirCorps
    const gears = toGears(items)
    gears.forEach((gear, gearIndex) => {
      if (gear) {
        lbac.createGear(gearIndex, gear)
      }
    })

    if (mode === AirCorpsMode.Sortie) {
      lbac.mode = LandBasedAirCorpsMode.Sortie2
    } else {
      lbac.mode = LandBasedAirCorpsMode.Standby
    }
  })

  return operation
}
