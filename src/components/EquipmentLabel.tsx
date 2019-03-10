import React from 'react'

import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentIcon from './EquipmentIcon'

import { IEquipment } from 'kc-calculator'
import ProficiencyIcon from './ProficiencyIcon'

const useStyles = makeStyles({
  card: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      filter: 'brightness(120%)'
    }
  },
  icon: {
    width: 32,
    height: 32
  },
  typography: {
    fontSize: 12
  },
  right: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: 4,
    alignItems: 'center'
  }
})

interface EquipmentLabelProps {
  equipment: IEquipment
  slotSize?: number
}

const EquipmentLabel: React.FC<EquipmentLabelProps> = ({ equipment, slotSize }) => {
  const classes = useStyles()
  const { proficiency, improvement } = equipment
  return (
    <Paper className={classes.card} elevation={1}>
      <EquipmentIcon className={classes.icon} iconId={equipment.iconId} />

      <Typography variant="caption">{equipment.name}</Typography>

      <div className={classes.right}>
        {equipment.category.isAerialCombatAircraft && (
          <ProficiencyIcon style={{ marginRight: 8 }} internal={proficiency.internal} />
        )}
        <div>
          <Typography>{'★' + improvement.value}</Typography>
          <Typography>{slotSize}</Typography>
        </div>
      </div>
    </Paper>
  )
}

export default EquipmentLabel
