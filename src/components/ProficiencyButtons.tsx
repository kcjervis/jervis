import IconButton from '@material-ui/core/IconButton'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'

import ProficiencyIcon from './ProficiencyIcon'

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  proficiencyButton: {
    padding: 0,
    '&:hover': {
      filter: 'brightness(150%)'
    }
  }
})

interface IProficiencyButtonsProps extends WithStyles {
  equipmentId: number
  updateEquipment: (payload: { id: number; internalProficiency: number }) => void
}

const ProficiencyButtons: React.SFC<IProficiencyButtonsProps> = ({ equipmentId, updateEquipment, classes }) => {
  const proficiencies = [0, 10, 25, 40, 55, 70, 85, 100, 120]
  const handleUpdateInternalProficiency = (value: number) => () => {
    updateEquipment({ id: equipmentId, internalProficiency: value })
  }
  return (
    <div className={classes.root}>
      {proficiencies.map(value => (
        <IconButton key={value} className={classes.proficiencyButton} onClick={handleUpdateInternalProficiency(value)}>
          <ProficiencyIcon internalProficiency={value} />
        </IconButton>
      ))}
    </div>
  )
}

export default withStyles(styles)(ProficiencyButtons)
