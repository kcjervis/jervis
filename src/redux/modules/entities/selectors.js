import ships from '../../../utils/ships'
import equipments from '../../../utils/equipments'

const shipsSelector = state => state.entities.get('ships')
const equipmentsSelector = state => state.entities.get('equipments')

const fleetSelector = ({ entities }, { fleetsId }) => {
  if (!fleetsId) return null
  const fleet = entities.getIn(['fleets', fleetsId]).toJS()
  return fleet
}

const shipSelector = ({ entities }, { shipsId }) => {
  if (!shipsId) return null
  const ship = entities.getIn(['ships', shipsId]).toJS()
  ship.image = {}
  try {
    ship.image.banner = require(`../../../images/ships/banner/${ship.id}.png`)
  } catch (error) {
    console.error(error)
  }
  return { ...ships[ship.id], ...ship }
}

const equipmentSelector = ({ entities }, { equipmentsId }) => {
  if (!equipmentsId) return null
  const equipment = entities.getIn(['equipments', equipmentsId]).toJS()
  equipment.image = {}
  try {
    const type3 = equipments[equipment.id].types[3]
    equipment.image.icon = require(`../../../images/equipments/icons/${type3}.png`)
  } catch (error) {
    console.error(error)
  }
  return { ...equipments[equipment.id], ...equipment }
}

export default {
  fleetSelector,
  shipSelector,
  equipmentSelector
}
