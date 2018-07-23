import shipClassesData from './shipClassesData'
import shipClasses from './shipClasses'
import shipsDataa from './ships-data'
import ships from './ships'

export const formatWctfShip = shipData => {
  let { id, no: sortNo, type, equip, remodel } = shipData
  const name = shipData.name.ja_jp
  const kana = shipData.name.ja_kana
  type = changeShipType(type)
  if (!type) console.log(name)
  const sClass = getShipClass(shipData.class)
  if (!sClass) console.log(name, shipData.class)
  const classNo = shipData.class_no
  const { fuel, ammo } = shipData.consum
  const slots = shipData.slot
  const equipments =
    equip &&
    equip.filter(e => e).map(e => {
      const { id, star } = e
      if (e.id) {
        return {
          id,
          improvement: star
        }
      }
      return {
        id: e
      }
    })
  if (remodel) {
    let { prev, next, next_lvl: nextLevel, prev_loop: prevLoop } = remodel
    if (prevLoop) next = prev
    remodel = { prev, next, nextLevel }
  }
  const {
    hp: initialHp,
    hp_max: maxHp,

    fire: initialFirepower,
    fire_max: maxFirepower,
    torpedo: initialTorpedo,
    torpedo_max: maxTorpedo,
    aa: initialAntiAir,
    aa_max: maxAntiAir,
    armor: initialArmor,
    armor_max: maxArmor,

    asw: initialAsw,
    asw_max: maxAsw,
    evasion: initialEvasion,
    evasion_max: maxEvasion,
    los: initialLos,
    los_max: maxLos,

    luck: initialLuck,
    luck_max: maxLuck,

    speed,
    range
  } = shipData.stat
  const stats = {
    initialHp,
    maxHp,

    initialFirepower,
    maxFirepower,
    initialTorpedo,
    maxTorpedo,
    initialAntiAir,
    maxAntiAir,
    initialArmor,
    maxArmor,

    initialAsw,
    maxAsw,
    initialEvasion,
    maxEvasion,
    initialLos,
    maxLos,

    initialLuck,
    maxLuck,

    speed,
    range
  }
  return {
    id,
    sortNo,
    name,
    kana,
    type,
    class: sClass,
    classNo,
    stats,
    fuel,
    ammo,
    slots,
    equipments,
    remodel
  }
}

const changeShipType = type => {
  const shipTypes = [
    { id: 1, types: [31] },
    { id: 2, types: [1, 19] },
    { id: 3, types: [2, 28] },
    { id: 4, types: [3] },
    { id: 5, types: [4, 23, 25] },
    { id: 6, types: [5] },
    { id: 7, types: [9, 30, 32] },
    { id: 8, types: [7, 26] },
    { id: 9, types: [6] },
    { id: 10, types: [8, 33] },
    { id: 11, types: [10] },
    { id: 12, types: [] },
    { id: 13, types: [13, 27] },
    { id: 14, types: [14] },
    { id: 15, types: [] },
    { id: 16, types: [12, 24] },
    { id: 17, types: [15] },
    { id: 18, types: [11] },
    { id: 19, types: [16] },
    { id: 20, types: [17] },
    { id: 21, types: [21] },
    { id: 22, types: [29] }
  ]

  const apiType = shipTypes.find(({ types }) => types.includes(type))
  return apiType && apiType.id
}

const checkProp = (stats, statsData) => {
  for (const name in stats) {
    if (stats[name] === statsData[name]) continue
    console.log(name, stats[name], statsData[name])
  }
}

export const checkShipData = (ship, shipData) => {
  checkProp(ship.stats, shipData.stats)
  checkProp(ship.remodel, shipData.remodel)
}

const getShipClass = id => {
  const shipClass = shipClassesData.find(shipClass => shipClass.id === id)
  const className = shipClass.name.ja_jp
  for (const id in shipClasses) {
    const name = shipClasses[id]
    if (name.includes(className)) return parseInt(id, 10)
  }
  if ([5].includes(id)) return 49
  if ([61, 67].includes(id)) return 36
  if ([90].includes(id)) return 9
  if ([93].includes(id)) return 73
  if ([103].includes(id)) return 57
  if ([104].includes(id)) return 80
  if ([113].includes(id)) return 2
}

const getData = async () => {
  const res = await fetch(
    'https://script.google.com/macros/s/AKfycbxDaJSDorETg38287HBHmm1iYubxdeEXgmBNKPPb39lWnkG-u4/exec'
  )
  const json = await res.json()
  console.log(json)
}

getData()

const _objToCsv = (obj, line, propNames, parentKey) => {
  if (!obj) return false

  for (let [key, value] of Object.entries(obj)) {
    if (parentKey) {
      key = Array.isArray(obj) ? parentKey + `[${key}]` : parentKey + '.' + key
    }

    if (typeof value !== 'object') {
      let propIndex = propNames.findIndex(name => name === key)
      if (propIndex < 0) propIndex = propNames.push(key)
      line[propIndex] = value
    } else {
      _objToCsv(value, line, propNames, key)
    }
  }
}

const shipsToCsv = ships => {
  const propNames = []
  const lines = ships.map(ship => {
    const line = []
    _objToCsv(ship, line, propNames)
    return line.join(',')
  })
  lines.unshift(propNames.join(','))
  return lines.join('\r\n')
}

const calculateBonus = (A6, armor, ciBonus, damage) => {
  const minDef = 0.7 * armor
  const maxDef = 1.3 * armor - 0.6
  const Cmin = Math.ceil(damage + minDef)
  const Cmax = Math.ceil(damage + 1 + maxDef)
  const A9 = A6 * 1.5 * ciBonus

  return [Cmin / A9, Cmax / A9]
}
const searchBonus = (A6, armor, ciBonus, damage) => {
  const bonuses = []
  for (let num = 1; num <= 1000 * 3; num++) {
    const a9 = num / 1000
    const attackPower = Math.floor(A6 * ciBonus * a9 * 1.5)
    const damages = getDefs(armor)
      .map(getDamageCalc(attackPower))
      .sort()
    if (damages[0] <= damage && damage <= damages[1]) {
      bonuses.push(a9)
    }
  }
}
