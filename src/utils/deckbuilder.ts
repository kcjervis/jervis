import { IEquipmentDataObject, IShipDataObject } from 'kc-calculator'
import { Proficiency } from 'kc-calculator/dist/objects/Equipment'
import { calcHpAtLevel, calcStatAtLevel } from 'kc-calculator/dist/objects/Ship/ShipNakedStats'

import { masterData } from '../stores/kcObjectFactory'
import { ObservableOperation } from '../stores'

export interface DeckEquipmet {
  id: number | null
  rf: number | string
  mas: number | string
}

const toEquipmentDataObject = (item: DeckEquipmet | undefined): IEquipmentDataObject | undefined => {
  if (!item || !item.id) {
    return undefined
  }

  const proficiency = Proficiency.internalBounds[Number(item.mas)]
  return {
    masterId: item.id,
    improvement: Number(item.rf),
    proficiency
  }
}

export interface DeckShip {
  id: string | number | null
  lv: number
  luck?: number
  hp?: number
  asw?: number
  items: Partial<{
    i1: DeckEquipmet
    i2: DeckEquipmet
    i3: DeckEquipmet
    i4: DeckEquipmet
    i5: DeckEquipmet
    ix: DeckEquipmet
  }>
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

  const equipments = Array<IEquipmentDataObject | undefined>(masterShip.slotCapacities.length)
  Object.entries(items).forEach(([key, item]) => {
    const index = Number(key.replace('i', ''))
    if (!isNaN(index)) {
      equipments[index - 1] = toEquipmentDataObject(item)
    }
  })

  if ('ix' in items) {
    const { ix } = items
    equipments.push(toEquipmentDataObject(ix))
  }
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
    equipments,
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

export interface Nishikuma {
  version: number
  lang?: 'ja' | 'en' | 'ko' | 'scn' | 'tcn'
  theme?: 'dark'
  hqlv?: number
  f1?: DeckFleet
  f2?: DeckFleet
  f3?: DeckFleet
  f4?: DeckFleet
}

export const setDeckbuilder = (operation: ObservableOperation, { hqlv = 120, f1, f2, f3, f4 }: Nishikuma) => {
  operation.hqLevel = hqlv
  ;[f1, f2, f3, f4].forEach((deckFleet, fleetIndex) => {
    if (!deckFleet) {
      return
    }

    const fleet = operation.fleets[fleetIndex]
    Object.entries(deckFleet).forEach(([shipKey, deckShip]) => {
      const shipIndex = Number(shipKey.replace('s', ''))
      if (isNaN(shipIndex)) {
        return
      }
      const shipData = toShipDataObject(deckShip)
      if (shipData) {
        fleet.createShip(shipIndex - 1, shipData)
      }
    })
  })

  return operation
}
