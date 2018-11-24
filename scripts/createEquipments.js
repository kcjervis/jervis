const fs = require('fs')
const { api_mst_slotitem } = require('@kancolle/data')

const equipmentPropMap = [
  { prop: 'id', mstProp: 'api_id', type: 'number' },
  // { prop: 'sortNo', mstProp: 'api_sortno', type: 'number' },
  { prop: 'name', mstProp: 'api_name', type: 'string' },
  { prop: 'typeIds', mstProp: 'api_type', type: 'Array' },
  { prop: 'hp', mstProp: 'api_taik', type: 'number' },
  { prop: 'armor', mstProp: 'api_souk', type: 'number' },
  { prop: 'firepower', mstProp: 'api_houg', type: 'number' },
  { prop: 'torpedo', mstProp: 'api_raig', type: 'number' },
  { prop: 'speed', mstProp: 'api_soku', type: 'number' },
  { prop: 'bombing', mstProp: 'api_baku', type: 'number' },
  { prop: 'antiAir', mstProp: 'api_tyku', type: 'number' },
  { prop: 'asw', mstProp: 'api_tais', type: 'number' },
  { prop: 'accuracy', mstProp: 'api_houm', type: 'number' },
  { prop: 'evasion', mstProp: 'api_houk', type: 'number' },
  { prop: 'los', mstProp: 'api_saku', type: 'number' },
  { prop: 'luck', mstProp: 'api_luck', type: 'number' },
  { prop: 'range', mstProp: 'api_leng', type: 'number' },
  { prop: 'radius', mstProp: 'api_distance', type: 'number' },
]

const newEquipmentsData = []
for (const mstEquipment of api_mst_slotitem) {
  const newData = {}
  for (const { prop, mstProp } of equipmentPropMap) {
    const mstValue = mstEquipment[mstProp]
    if (!mstValue) continue
    newData[prop] = mstValue
  }
  newEquipmentsData.push(newData)
}
fs.writeFile('equipments.json', JSON.stringify(newEquipmentsData), err => {
  console.log(err)
})