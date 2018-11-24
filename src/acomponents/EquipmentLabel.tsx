import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentIcon from './EquipmentIcon'

import { IEquipment } from 'kc-calculator'
import ProficiencyIcon from './ProficiencyIcon'

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    card: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      width: '100%',
      height: '100%',
      '&:hover': {
        filter: 'brightness(120%)'
      }
    },
    typography: {
      fontSize: 12
    }
  })

interface IEquipmentLabelProps extends WithStyles<typeof styles> {
  equipment?: IEquipment
}

const EquipmentLabel: React.SFC<IEquipmentLabelProps> = ({ equipment, classes }) => {
  if (!equipment) {
    return null
  }
  const { proficiency, improvement } = equipment
  return (
    <div className={classes.root}>
      <Card className={classes.card} elevation={0}>
        <EquipmentIcon iconId={equipment.iconId} />
        <Typography>{equipment.name}</Typography>
        <div style={{ display: 'flex', marginLeft: 'auto' }}>
          {proficiency.internal > 0 && <ProficiencyIcon proficiency={proficiency} />}
          <div style={{ margin: 5 }}>
            <Typography className={classes.typography}>{'★' + improvement.value}</Typography>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default withStyles(styles)(EquipmentLabel)
