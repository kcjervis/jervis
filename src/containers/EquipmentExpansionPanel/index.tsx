import React from 'react'

import { Theme } from '@material-ui/core'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/styles'

import { EquipmentIcon } from '../../components'
import EquipmentField from '../EquipmentField'
import EquipmentAvatar from '../EquipmentAvatar'

import stores, { ObservableEquipment, ObservableLandBasedAirCorps, ObservableShip } from '../../stores'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  equipment: {
    margin: 4
  }
}))

interface EquipmentExpansionPanelProps {
  parent: ObservableShip | ObservableLandBasedAirCorps
  equipments: Array<ObservableEquipment | undefined>
}

const EquipmentExpansionPanel: React.FC<EquipmentExpansionPanelProps> = props => {
  const classes = useStyles()
  const { equipments, parent } = props
  const handleEndDrag = stores.operationStore.switchEquipment
  return (
    <div>
      {equipments.map((equip, index) => equip && <EquipmentAvatar key={index} equipment={equip} />)}
      {equipments.map((equip, index) => (
        <EquipmentField
          key={index}
          className={classes.equipment}
          onEndDrag={handleEndDrag}
          parent={parent}
          index={index}
          equipment={equip}
        />
      ))}
    </div>
  )
}

export default EquipmentExpansionPanel
