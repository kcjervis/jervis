const axios = require('axios')
const fs = require('fs')
const lodash = require('lodash')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const getPoiEnemyFleets = async (mapId, point, difficulty) => {
  const pointInfo = difficulty ? `${mapId}/${difficulty}/${point}` : `${mapId}/${point}`
  const url = `https://db.kcwiki.org/drop/map/${pointInfo}-SAB.json`
  const res = await axios.get(url).catch(err => {
    if (err.response.status !== 404) {
      console.log(err)
    }
  })
  await sleep(100)

  if (!res) {
    console.log(`${url} is not found`)
    return 404
  }

  // DropObject = { rankCount: number[], totalCount: number, hqLv: number[], rate: number, enemy: DropEnemyObject }
  // DropEnemyObject = { [K in string]: CountObject }
  // CountObject = { count: number[], rate: number }
  const dropObjects = Object.values(res.data.data)
  const dropEnemyObjects = dropObjects.map(({ enemy }) => enemy)
  const enemyCountMap = new Map()

  dropEnemyObjects.forEach(dropEnemyObject => {
    Object.entries(dropEnemyObject).forEach(([enemyName, countObject]) => {
      const totalCount = lodash.sum(countObject.count)
      const enemyCount = enemyCountMap.get(enemyName)
      if (enemyCount) {
        enemyCountMap.set(enemyName, enemyCount + totalCount)
      } else {
        enemyCountMap.set(enemyName, totalCount)
      }
    })
  })

  if (enemyCountMap.size === 0) {
    console.log(`map: ${mapId}, point: ${point} is not enemy`)
    return null
  }

  console.log(`map: ${mapId}, point: ${point} is successful`)

  return Array.from(enemyCountMap)
    .filter(([enemyName, count]) => count >= 3)
    .map(([enemyName, count]) => {
      const ships = enemyName.match(/\d+(?=\))/g).map(Number)
      const formation = enemyName.match(/\((\D+)\)/)[1]
      return { ships, formation, difficulty }
    })
}

const getPoiEventCell = async (mapId, point) => {
  const cell = {
    point,
    enemies: []
  }
  for (const difficulty of [1, 2, 3, 4]) {
    const enemies = await getPoiEnemyFleets(mapId, point, difficulty)
    if (enemies === 404) {
      return 404
    }
    if (!enemies) {
      continue
    }
    cell.enemies.push(...enemies)
  }
  return cell
}

const indexToChar = index => {
  const initialCode = 'A'.charCodeAt(0)
  if (index > 35) {
    return 'Q' + (index - 35)
  }
  if (index > 30) {
    return 'P' + (index - 30)
  }
  if (index > 25) {
    return 'Z' + (index - 25)
  }
  return String.fromCharCode(initialCode + index)
}

const getPoiNormalMap = async mapId => {
  const map = {
    mapId,
    cells: []
  }

  const points = lodash.times(30).map(indexToChar)
  for (const point of points) {
    const enemies = await getPoiEnemyFleets(mapId, point)
    if (enemies && enemies !== 404) {
      map.cells.push({
        point,
        enemies
      })
    }
  }
  return map
}

const getPoiEventMap = async mapId => {
  const map = {
    mapId,
    cells: []
  }
  const points = lodash.times(30).map(indexToChar)
  for (const point of points) {
    const cell = await getPoiEventCell(mapId, point)
    if (cell !== 404) {
      map.cells.push(cell)
    }
  }
  return map
}

const writeMaps = async mapIds => {
  const maps = require('../src/data/maps')
  for (const mapId of mapIds) {
    if (maps.some(map => map.mapId === mapId)) {
      continue
    }
    if (mapId < 100) {
      const map = await getPoiNormalMap(mapId)
      maps.push(map)
    } else {
      const map = await getPoiEventMap(mapId)
      maps.push(map)
    }
  }
  fs.writeFile('maps.json', JSON.stringify(maps), err => {
    console.log(err)
  })
  return null
}

const createMapIds = ([worldId, length]) => lodash.range(worldId * 10 + 1, worldId * 10 + 1 + length)

writeMaps([[1, 6], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 2], [44, 5]].flatMap(createMapIds))
