import React from 'react'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import EquipmentIcon from '../components/EquipmentIcon'
import stores, { ObservableEquipment, ObservableLandBasedAirCorps, ObservableShip } from '../stores'
import EquipmentField from './EquipmentField'

interface EquipmentExpansionPanelProps {
  parent: ObservableShip | ObservableLandBasedAirCorps
  equipments: Array<ObservableEquipment | undefined>
}

const EquipmentExpansionPanel: React.FC<EquipmentExpansionPanelProps> = props => {
  const { equipments, parent } = props
  const handleEndDrag = stores.operationStore.switchEquipment
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {equipments.map((equip, index) => (
        <EquipmentField key={index} onEndDrag={handleEndDrag} parent={parent} index={index} equipment={equip} />
      ))}
    </div>
  )
}

export default EquipmentExpansionPanel
