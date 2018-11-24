import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'

import Typography from '@material-ui/core/Typography'

import { CloseButton, RemoveButton, UpdateButton } from '../components/IconButtons'
import EquipmentIcon from './EquipmentIcon'
import EquipmentImage from './EquipmentImage'
import ImprovementButtons from './ImprovementButtons'
import ProficiencyButtons from './ProficiencyButtons'
import ProficiencyIcon from './ProficiencyIcon'
import StatLabel from './StatLabel'

import { EquipmentModel } from '../calculator'

const styles: StyleRulesCallback = theme => ({
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

interface IEquipmentCardProps extends WithStyles {
  equipment: EquipmentModel
  onRemove?: () => void
  onClose?: React.MouseEventHandler<HTMLInputElement>
  onReselect?: () => void
  updateEquipment?: (payload: { id: number; improvement?: number; internalProficiency?: number }) => void
}

const EquipmentCard: React.SFC<IEquipmentCardProps> = ({
  equipment,
  onRemove,
  onReselect,
  onClose,
  updateEquipment,
  classes
}) => {
  const { master, improvement, internalProficiency } = equipment
  const { id: masterId, sortNo, name, typeIds, ...stats } = master

  const equipmentId = equipment.id

  const { isAerialCombatAircraft } = equipment.type.aircraftType

  return (
    <Card className={classes.root} elevation={12}>
      <div className={classes.buttons}>
        {onRemove && <RemoveButton onClick={onRemove} />}
        {onReselect && <UpdateButton onClick={onReselect} />}
        {onClose && <CloseButton onClick={onClose} />}
      </div>

      <Typography className={classes.title} variant="h5">
        <EquipmentIcon iconId={equipment.type.iconId} />
        {name}
      </Typography>

      <Typography align="center">
        ID {masterId} 種別 {typeIds.join(',')}
      </Typography>

      <div className={classes.details}>
        {/* ステータス一覧 */}
        <CardContent className={classes.stats}>
          {Object.entries(stats)
            .filter(([key, value]) => value > 0)
            .map(([key, value]) => (
              <StatLabel key={key} statName={key} value={value} />
            ))}
        </CardContent>
        <EquipmentImage className={classes.image} masterId={equipment.masterId} />
      </div>
      {updateEquipment && equipmentId !== undefined && (
        <ImprovementButtons equipmentId={equipmentId} updateEquipment={updateEquipment} />
      )}

      {updateEquipment && equipmentId !== undefined && isAerialCombatAircraft && (
        <ProficiencyButtons equipmentId={equipmentId} updateEquipment={updateEquipment} />
      )}
    </Card>
  )
}

export default withStyles(styles)(EquipmentCard)
