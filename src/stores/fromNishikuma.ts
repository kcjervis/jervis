import { IEquipmentDataObject, IShipDataObject } from 'kc-calculator'
import { Proficiency } from 'kc-calculator/dist/objects/Equipment'

import { masterData } from './kcObjectFactory'
import ObservableOperation from './ObservableOperation'

export interface IDeckEquipmet {
  id: number | null
  rf: number
  mas: number
}

const toEquipmentDataObject = (item: IDeckEquipmet | undefined): IEquipmentDataObject | undefined => {
  if (!item || !item.id) {
    return undefined
  }

  const proficiency = Proficiency.internalBounds[item.mas]
  return {
    masterId: item.id,
    improvement: item.rf,
    proficiency
  }
}

export interface IDeckShip {
  id: string | number | null
  lv: number
  luck?: number
  hp?: number
  asw?: number
  items: Partial<{
    i1: IDeckEquipmet
    i2: IDeckEquipmet
    i3: IDeckEquipmet
    i4: IDeckEquipmet
    i5: IDeckEquipmet
    ix: IDeckEquipmet
  }>
}

const toShipDataObject = (deckShip: IDeckShip | undefined): IShipDataObject | undefined => {
  console.log(deckShip)
  if (!deckShip || !deckShip.id) {
    return undefined
  }
  const { items, lv } = deckShip
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

  return {
    masterId: shipId,
    level: lv,
    equipments,
    slots: masterShip.slotCapacities
  }
}

export type DeckFleet = Partial<{
  s1: IDeckShip
  s2: IDeckShip
  s3: IDeckShip
  s4: IDeckShip
  s5: IDeckShip
  s6: IDeckShip
  s7: IDeckShip
}>

export interface INishikuma {
  version: number
  lang?: 'ja' | 'en' | 'ko' | 'scn' | 'tcn'
  theme?: 'dark'
  hqlv?: number
  f1?: DeckFleet
  f2?: DeckFleet
  f3?: DeckFleet
  f4?: DeckFleet
}

const fromNishikuma = ({ f1, f2, f3, f4 }: INishikuma) => {
  const operation = new ObservableOperation()
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

export default fromNishikuma
