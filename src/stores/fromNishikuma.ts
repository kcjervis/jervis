import { IEquipmentDataObject, IShipDataObject } from 'kc-calculator'
import { masterData } from './kcObjectFactory'
import ObservableOperation from './ObservableOperation'

interface IDeckEquipmet {
  id: number | null
  rf: number
  mas: number
}

const toEquipmentDataObject = (item: IDeckEquipmet | undefined): IEquipmentDataObject | undefined => {
  if (!item || !item.id) {
    return undefined
  }
  return {
    masterId: item.id,
    improvement: item.rf,
    proficiency: item.mas
  }
}

interface IDeckShip {
  id: number | null
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
  if (!deckShip || !deckShip.id) {
    return undefined
  }
  const { items, lv, id } = deckShip
  const masterShip = masterData.findMasterShip(id)
  if (!masterShip) {
    return undefined
  }

  const equipments = Array<IEquipmentDataObject | undefined>()
  Object.entries(items).forEach(([key, item]) => {
    const index = Number(key.replace('i', ''))
    if (!isNaN(index)) {
      equipments[index] = toEquipmentDataObject(item)
    }
  })

  if ('ix' in items) {
    const { ix } = items
    equipments.push(toEquipmentDataObject(ix))
  }

  return {
    masterId: id,
    level: lv,
    equipments,
    slots: masterShip.slotCapacities
  }
}

type DeckFleet = Partial<{
  s1: IDeckShip
  s2: IDeckShip
  s3: IDeckShip
  s4: IDeckShip
  s5: IDeckShip
  s6: IDeckShip
  s7: IDeckShip
}>

const toFleetDataObject = (deckFleet: DeckFleet) => {
  const ships = new Array<IShipDataObject | undefined>()
  Object.entries(deckFleet).forEach(([key, deckShip]) => {
    const index = Number(key.replace('s', ''))
    if (!isNaN(index)) {
      ships[index] = toShipDataObject(deckShip)
    }
  })
}

interface INishikuma {
  version: number
  lang?: 'ja' | 'en' | 'ko' | 'scn' | 'tcn'
  theme?: 'dark'
  hqlv: number
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
