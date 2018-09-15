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
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.7)'
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

  return (
    <Card className={classes.root} elevation={12}>
      <div className={classes.buttons}>
        {onRemove && <RemoveButton onClick={onRemove} />}
        {onReselect && <UpdateButton onClick={onReselect} />}
        {onClose && <CloseButton onClick={onClose} />}
      </div>

      <Typography className={classes.title} variant="headline">
        <EquipmentIcon iconId={equipment.type.iconId} />
        {name}
      </Typography>

      <Typography align="center">
        ID {masterId} 種別 {typeIds.join(',')}
      </Typography>

      <div className={classes.details}>
        <CardContent>
          {/* ステータス一覧 */}
          {Object.entries(stats).map(([key, value]) => {
            if (value === 0) {
              return null
            }
            return <StatLabel key={key} statName={key} value={value} />
          })}
        </CardContent>
        <EquipmentImage className={classes.image} masterId={equipment.masterId} />
      </div>

      {updateEquipment && <ImprovementButtons equipmentId={equipment.id} updateEquipment={updateEquipment} />}

      {updateEquipment &&
        internalProficiency >= 0 && <ProficiencyButtons equipmentId={equipment.id} updateEquipment={updateEquipment} />}
    </Card>
  )
}

export default withStyles(styles)(EquipmentCard)
