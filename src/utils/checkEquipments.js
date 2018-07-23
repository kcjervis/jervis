import equipmentsData from './equipments-data'
import equipments from './equipments'

export default () => {
  const idsData = equipmentsData.map(e => e.id)
  const equipmentIds = Object.keys(equipments).map(id => +id)
  const result = {}
  for (const id of idsData) {
    if (equipmentIds.includes(id)) continue
    const data = equipmentsData.find(data => data.id === id)
    const { stat } = data
    const newStats = {}
    for (const s in stat) {
      const value = stat[s]
      if (!value) continue
      if (s === 'fire') newStats.firepower = value
      else if (s === 'aa') newStats.antiAir = value
      else if (s === 'hit') newStats.accuracy = value
      else newStats[s] = value
    }
    let type
    if (data.type_ingame) type = data.type_ingame[2]
    result[id] = {
      id: id,
      type,
      name: data.name.ja_jp,
      ...newStats,
      types: data.type_ingame
    }
  }
  return result
}
