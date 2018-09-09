import Button from '@material-ui/core/Button'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  improvement: {
    minWidth: 0
  }
})

interface IImprovementButtonsProps extends WithStyles {
  equipmentId: number
  updateEquipment: (payload: { id: number; improvement: number }) => void
}

const ImprovementButtons: React.SFC<IImprovementButtonsProps> = ({ equipmentId, updateEquipment, classes }) => {
  const improvements = Array.from({ length: 11 }, (_, k) => k)
  const handleUpdateImprovement = (value: number) => () => {
    updateEquipment({ id: equipmentId, improvement: value })
  }
  return (
    <div className={classes.root}>
      {improvements.map(value => (
        <Button key={value} className={classes.improvement} onClick={handleUpdateImprovement(value)} size="small">
          {'★' + value}
        </Button>
      ))}
    </div>
  )
}

export default withStyles(styles)(ImprovementButtons)
