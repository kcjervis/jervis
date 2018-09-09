import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'

import Typography from '@material-ui/core/Typography'

import { CloseButton, RemoveButton, UpdateButton } from '../components/IconButtons'
import ImprovementButtons from './ImprovementButtons'
import ProficiencyButtons from './ProficiencyButtons'
import ProficiencyIcon from './ProficiencyIcon'
import StatLabel from './StatLabel'

const displayedStatNames = [
  'firepower',
  'torpedo',
  'antiAir',
  'armor',
  'asw',
  'evasion',
  'los',
  'luck',
  'speed',
  'range',
  'antiBomber',
  'interception',
  'types',
  'improvement',
  'internalProficiency'
]

const getItemOnImage = (masterId: number) => {
  try {
    return require(`../images/equipments/itemOn/${masterId}.png`)
  } catch (error) {
    console.log(error)
  }
}

const styles: StyleRulesCallback = theme => ({
  root: {
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.7)'
  },
  title: {
    margin: theme.spacing.unit
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  details: {
    display: 'flex',
    justifyContent: 'space-around'
  }
})

interface IEquipmentCardProps extends WithStyles {
  equipment: any
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
  const { id, masterId, name, improvement, internalProficiency } = equipment

  const itemOnImage = getItemOnImage(masterId)

  return (
    <Card className={classes.root} elevation={12}>
      <div className={classes.buttons}>
        {onRemove && <RemoveButton onClick={onRemove} />}
        {onReselect && <UpdateButton onClick={onReselect} />}
        {onClose && <CloseButton onClick={onClose} />}
      </div>

      <Typography className={classes.title} align="center" variant="headline">
        ID
        {masterId} {name}
      </Typography>

      <div className={classes.details}>
        <CardContent>
          {displayedStatNames.map(statName => {
            const value = equipment[statName]
            if (!value) {
              return null
            }
            if (statName === 'internalProficiency' && value) {
              return <ProficiencyIcon key={statName} internalProficiency={value} />
            }
            return <StatLabel key={statName} statName={statName} value={value} />
          })}
        </CardContent>
        <img
          src={itemOnImage}
          style={{
            maxWidth: 300,
            height: 'auto'
          }}
        />
      </div>

      {updateEquipment && <ImprovementButtons equipmentId={id} updateEquipment={updateEquipment} />}

      {updateEquipment &&
        internalProficiency >= 0 && <ProficiencyButtons equipmentId={id} updateEquipment={updateEquipment} />}
    </Card>
  )
}

export default withStyles(styles)(EquipmentCard)
