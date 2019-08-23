import React from 'react'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { GearIcon } from '../../components'
import GearField from '../GearField'
import GearAvatar from '../GearAvatar'

import { ObservableGear, ObservableLandBasedAirCorps, ObservableShip } from '../../stores'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  gear: {
    margin: 4
  }
}))

interface EquipmentExpansionPanelProps {
  store: ObservableShip | ObservableLandBasedAirCorps
  gears: Array<ObservableGear | undefined>
}

const EquipmentExpansionPanel: React.FC<EquipmentExpansionPanelProps> = props => {
  const classes = useStyles()
  const { gears, store } = props
  return (
    <div>
      {gears.map((gear, index) => gear && <GearAvatar key={index} gear={gear} />)}
      {gears.map((gear, index) => (
        <GearField key={index} className={classes.gear} store={store} index={index} gear={gear} />
      ))}
    </div>
  )
}

export default EquipmentExpansionPanel
