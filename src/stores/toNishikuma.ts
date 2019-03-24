import { IEquipment, IFleet, IOperation, IShip } from 'kc-calculator'

import { DeckFleet, DeckEquipmet, DeckShip, Nishikuma } from '../utils'

const toDeckEquipment = (equipment: IEquipment): DeckEquipmet => {
  const { masterId, improvement, proficiency } = equipment
  return {
    id: masterId,
    rf: improvement.value,
    mas: proficiency.level
  }
}

const isExpansionEquipment = (ship: IShip, equip: IEquipment) => {
  const equipIndex = ship.equipments.indexOf(equip)
  return equipIndex >= ship.slots.length
}

const toDeckShip = (ship: IShip): DeckShip => {
  const { masterId, level, equipments, nakedStats } = ship
  const items: { [K in string]: DeckEquipmet } = {}
  equipments.forEach((equip, index) => {
    if (!equip) {
      return
    }
    const key = isExpansionEquipment(ship, equip) ? 'ix' : `i${index + 1}`
    items[key] = toDeckEquipment(equip)
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
