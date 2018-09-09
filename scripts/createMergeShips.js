const fs = require('fs')
const start2 = require('./start2.json')
const shipsData = require('../src/data/ships.json')

const shipPropMap = [
  { prop: 'id', mstProp: 'api_id', type: 'number' },
  { prop: 'sortNo', mstProp: 'api_sortno', type: 'number' },
  { prop: 'sortId', mstProp: 'api_sort_id', type: 'number' },
  { prop: 'name', mstProp: 'api_name', type: 'string' },
  { prop: 'readingName', mstProp: 'api_yomi', type: 'string' },
  { prop: 'shipTypeId', mstProp: 'api_stype', type: 'number' },
  { prop: 'classId', mstProp: 'api_ctype', type: 'number' },
  { prop: 'classNo', mstProp: 'api_cnum', type: 'number' },
  { prop: 'Hp', mstProp: 'api_taik', type: 'TStatTuple' },
  { prop: 'Armor', mstProp: 'api_souk', type: 'TStatTuple' },
  { prop: 'Firepower', mstProp: 'api_houg', type: 'TStatTuple' },
  { prop: 'Torpedo', mstProp: 'api_raig', type: 'TStatTuple' },
  { prop: 'AntiAir', mstProp: 'api_tyku', type: 'TStatTuple' },
  { prop: 'Asw', mstProp: 'api_tais', type: 'TStatTuple' },
  { prop: 'Evasion', mstProp: 'api_houk', type: 'TStatTuple' },
  { prop: 'Los', mstProp: 'api_saku', type: 'TStatTuple' },
  { prop: 'Luck', mstProp: 'api_luck', type: 'TStatTuple' },
  { prop: 'baseSpeed', mstProp: 'api_soku', type: 'number' },
  { prop: 'baseRange', mstProp: 'api_leng', type: 'number' },
  { prop: 'maxFuel', mstProp: 'api_fuel_max', type: 'number' },
  { prop: 'maxAmmo', mstProp: 'api_bull_max', type: 'number' },
]

const getSlots = (mstShip, shipData) => {
  const { api_slot_num, api_maxeq } = mstShip
  if (typeof api_maxeq === 'number') {
    return Array.from({ length: api_slot_num }, (_, i) => api_maxeq[i])
  }

  if (!shipData) return new Array(api_slot_num).fill(-1)
  return shipData.slots

}

const getRemodel = mstShip => {
  const { api_aftershipid, api_afterlv } = mstShip
  if (typeof api_aftershipid === 'string' && typeof api_afterlv === 'number') {
    return {
      nextId: Number(api_aftershipid),
      nextLevel: api_afterlv
    }
  }
  return {
    nextId: 0,
    nextLevel: 0
  }
}

const newShipsData = []
for (const mstShip of start2.api_data.api_mst_ship) {

  const shipData = shipsData.find(({ id }) => id === mstShip.api_id)
  const newShip = {}

  for (const { prop, mstProp, type } of shipPropMap) {
    const mstValue = mstShip[mstProp]
    const dataValue = shipData && shipData[prop]
    if (type === 'number' || type === 'string') {

      if (typeof mstValue !== 'undefined') {
        newShip[prop] = mstValue
      } else if (typeof dataValue !== 'undefined') {
        newShip[prop] = dataValue
      } else {
        newShip[prop] = type === 'number' ? -1 : ""
      }

    } else {

      if (mstValue && mstValue.length === 2) {
        newShip['min' + prop] = mstValue[0]
        newShip['max' + prop] = mstValue[1]
      } else if (shipData && typeof shipData['min' + prop] !== 'undefined') {
        newShip['min' + prop] = shipData['min' + prop]
        newShip['max' + prop] = shipData['max' + prop]
      } else {
        newShip['min' + prop] = -1
        newShip['max' + prop] = -1
      }

    }
  }
  newShip.slotCapacities = getSlots(mstShip, shipData)
  newShip.equipments = shipData ? shipData.equipments : []
  newShip.remodel = getRemodel(mstShip)
  newShipsData.push(newShip)
  if (!shipData) console.log(mstShip.api_name)
}
fs.writeFile('newShips.json', JSON.stringify(newShipsData), err => {
  console.log(err)
})