import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentIcon from './EquipmentIcon'
import EquipmentImage from './EquipmentImage'
import StatLabel from './StatLabel'

import { IEquipment } from 'kc-calculator'

type EquipmentStat =
  | 'hp'
  | 'armor'
  | 'firepower'
  | 'torpedo'
  | 'speed'
  | 'bombing'
  | 'antiAir'
  | 'asw'
  | 'accuracy'
  | 'interception'
  | 'evasion'
  | 'antiBomber'
  | 'los'
  | 'luck'
  | 'range'
  | 'radius'

const equipmentStats: EquipmentStat[] = [
  'hp',
  'armor',
  'firepower',
  'torpedo',
  'speed',
  'bombing',
  'antiAir',
  'asw',
  'accuracy',
  'interception',
  'evasion',
  'antiBomber',
  'los',
  'luck',
  'range',
  'radius'
]

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: 'rgba(0, 0, 0, 0.9)'
    },
    title: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: theme.spacing.unit
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    details: {
      display: 'flex',
      justifyContent: 'space-around'
    },
    stats: {
      display: 'flex',
      flexDirection: 'column'
    },
    image: {
      margin: theme.spacing.unit,
      alignSelf: 'center'
    }
  })

interface IEquipmentCardProps extends WithStyles<typeof styles> {
  equipment: IEquipment
}

const EquipmentCard: React.SFC<IEquipmentCardProps> = ({ equipment, classes }) => {
  const { masterId, category, iconId, name } = equipment

  return (
    <Card className={classes.root} elevation={12}>
      <Typography className={classes.title} variant="h5">
        <EquipmentIcon iconId={iconId} />
        {name}
      </Typography>

      <Typography align="center">
        ID {masterId} {category.name}
      </Typography>

      <div className={classes.details}>
        {/* ステータス一覧 */}
        <CardContent className={classes.stats}>
          {equipmentStats.map(statName => {
            const value = equipment[statName]
            if (value === 0) {
              return null
            }
            return <StatLabel key={statName} statName={statName} value={value} />
          })}
        </CardContent>
        <EquipmentImage className={classes.image} masterId={masterId} />
      </div>
    </Card>
  )
}

export default withStyles(styles)(EquipmentCard)
