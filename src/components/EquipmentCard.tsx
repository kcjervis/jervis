import React from 'react'

import { equipmentStatKeys, IEquipment } from 'kc-calculator'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentIcon from './EquipmentIcon'
import EquipmentImage from './EquipmentImage'
import StatChip from './StatChip'

const styles = (theme: Theme) =>
  createStyles({
    icon: {
      width: 32,
      height: 32
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
      alignSelf: 'center',
      maxWidth: 200
    }
  })

interface IEquipmentCardProps extends WithStyles<typeof styles> {
  equipment: IEquipment
  className?: string
  style?: React.CSSProperties
}

const EquipmentCard: React.FC<IEquipmentCardProps> = ({ equipment, classes, className, style }) => {
  const { masterId, category, iconId, name } = equipment

  return (
    <Card className={className} style={style} elevation={12}>
      <Typography variant="caption" align="left">
        ID:{masterId} {category.name}
      </Typography>

      <Typography className={classes.title} variant="subtitle1">
        <EquipmentIcon className={classes.icon} iconId={iconId} />
        {name}
      </Typography>

      <div className={classes.details}>
        {/* ステータス一覧 */}
        <CardContent className={classes.stats}>
          {equipmentStatKeys.map(statKey => {
            const value = equipment[statKey]
            if (value === 0) {
              return null
            }
            return <StatChip key={statKey} statKey={statKey} value={value} />
          })}
        </CardContent>
        <EquipmentImage className={classes.image} masterId={masterId} />
      </div>
    </Card>
  )
}

export default withStyles(styles)(EquipmentCard)
