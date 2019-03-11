import React from 'react'

import { equipmentStatKeys, IEquipment } from 'kc-calculator'

import { Theme } from '@material-ui/core'
import Card, { CardProps } from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentIcon from './EquipmentIcon'
import EquipmentImage from './EquipmentImage'
import StatChip from './StatChip'
import { RemoveButton, UpdateButton, CloseButton } from '../components/IconButtons'

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    width: 32,
    height: 32
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1)
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
    margin: theme.spacing(1),
    alignSelf: 'center',
    maxWidth: 160
  }
}))

interface EquipmentCardProps extends CardProps {
  equipment: IEquipment
  onRemove?: () => void
  onUpdate?: () => void
  onClose?: () => void
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onRemove, onUpdate, onClose, ...cardProps }) => {
  const classes = useStyles()
  const { masterId, category, iconId, name } = equipment
  return (
    <Card elevation={12} {...cardProps}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption">
          ID:{masterId} {category.name}
        </Typography>

        <div>
          {onRemove && (
            <RemoveButton title="装備を削除" tooltipProps={{ placement: 'top' }} size="small" onClick={onRemove} />
          )}
          {onUpdate && (
            <UpdateButton title="装備を変更" tooltipProps={{ placement: 'top' }} size="small" onClick={onUpdate} />
          )}
          {onClose && <CloseButton title="閉じる" tooltipProps={{ placement: 'top' }} size="small" onClick={onClose} />}
        </div>
      </div>

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

export default EquipmentCard
