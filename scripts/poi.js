const axios = require('axios')
const fs = require('fs')
const maps = require('../src/data/maps.json')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const getPoiEventEnemyFleets = async (mapId, difficulty, point) => {
  const res = await axios.get(`https://db.kcwiki.org/drop/map/${mapId}/${difficulty}/${point}-SAB.json`).catch(err => {
    if (err.response.status !== 404) {
      console.log(err)
    }
  })
  await sleep(100)

  if (!res) {
    console.log(`map: ${mapId}, point: ${point} is not found`)
    return 404
  }

  const enemyStrings = Object.values(res.data.data).map(({ enemy }) => Object.keys(enemy)).reduce((array, enemies) => array.concat(enemies), [])

  if (enemyStrings.length === 0) {
    console.log(`map: ${mapId}, point: ${point} is not enemy`)
    return null
  }

  console.log(`map: ${mapId}, point: ${point} is successful`)

  return Array.from(new Set(enemyStrings)).map(str => {
    ships = str.match(/\d+(?=\))/g).map(Number)
    formation = str.match(/\((\D+)\)/)[1]
    return { ships, formation, difficulty }
  })
}

const getPoiEventCell = async (mapId, point) => {
  const cell = {
    point,
    enemies: []
  }
  for (const difficulty of [1, 2, 3, 4]) {
    const enemies = await getPoiEventEnemyFleets(mapId, difficulty, point)
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
  if (index <= 25) {
    return String.fromCharCode(initialCode + index)
  }
  return 'Z' + (index - 25 + 1)
}

const getPoiEventMap = async (mapId) => {
  const map = {
    mapId,
    cells: []
  }
  const points = Array.from({ length: 30 }, (_, index) => indexToChar(index))
  for (const point of points) {
    const cell = await getPoiEventCell(mapId, point)
    if (cell !== 404) {
      map.cells.push(cell)
    }
  }
  return map
}

const writeMaps = async mapIds => {
  for (const mapId of mapIds) {
    const map = await getPoiEventMap(mapId)
    maps.push(map)
  }
  fs.writeFile('maps.json', JSON.stringify(maps), err => {
    console.log(err)
  })
  return null
}
writeMaps([431, 432, 433])


