import masterShips from './ships'
// import masterEquipments from './equipments'

import equipmentCategoryKeys from './equipmentCategoryKeys'
import statKeys from './statKeys'

import start2 from './start2'

const { api_data } = start2

const masterEquipments = api_data.api_mst_slotitem.map(raw => {
  const categoryId = raw.api_type[2]
  const masterEquipment = {}
  for (let { key, api } of statKeys) {
    if (!key) { continue }
    if (categoryId === 48) {
      if (api === 'api_houm') { key = 'antiBomber' }
      else if (api === 'api_houk') { key = 'interception' }
    } else {
      if (api === 'api_houm') { key = 'accuracy' }
      else if (api === 'api_houk') { key = 'evasion' }
    }

    const value = raw[api]
    if (value) { masterEquipment[key] = value }
  }
  return masterEquipment
})

const mstShips = api_data.api_mst_ship.map(raw => {
  const masterShip = {}
  for (const { key, api } of statKeys) {
    if (!key) { continue }
    const value = raw[api]
    if (value) { masterShip[key] = value }
  }
  return masterShip
})

//sortId,classIdを追加する一時的な対応
masterShips.forEach(masterShip => {
  const masterId = masterShip.id
  const mstShip = mstShips.find(({ id }) => id === masterId)
  if (mstShip) { masterShip.sortId = mstShip.sortId }

  //深海棲艦のclassIdを1に
  if (!masterShip.classId) { masterShip.classId = 1 }
})

console.log(mstShips)

const shipTypes = []
for (const apiShipType of api_data.api_mst_stype) {
  const { api_id, api_name, api_scnt, api_equip_type } = apiShipType
  shipTypes.push({
    id: api_id,
    name: api_name,
    repairTimeMultiplier: api_scnt,
    equipmentTypes: api_equip_type
  })
}
const equipmentCategories = []
for (const apiEquipmentType of api_data.api_mst_slotitem_equiptype) {
  const { api_id, api_name } = apiEquipmentType
  const { key } = equipmentCategoryKeys.find(({ id }) => id === api_id)
  equipmentCategories.push({
    id: api_id,
    name: api_name,
    key
  })
}

export default class MasterData {
  static get ships() {
    return masterShips
  }
  static get equipments() {
    return masterEquipments
  }

  static getShip(id) {
    return this.ships.find(ship => ship.id === id)
  }

  static getEquipment(id) {
    return this.equipments.find(equip => equip.id === id)
  }

  static get shipTypes() {
    return shipTypes
  }
  static get equipmentCategories() {
    return equipmentCategories
  }
}
