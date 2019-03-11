import React from 'react'

import { EquipmentStatKey, ShipStatKey } from 'kc-calculator'

import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import statKeys from '../data/statKeys'

const useStyles = makeStyles({
  root: {
    position: 'relative',
    paddingRight: 5,
    marginRight: 5
  },
  icon: {
    width: 18,
    height: 18,
    filter: 'contrast(150%) opacity(0.6)'
  },
  statKey: {
    fontSize: 10,
    position: 'absolute',
    right: -3,
    bottom: 0
  }
})

interface ShipIcon {
  statKey: ShipStatKey | EquipmentStatKey
  label?: string | number
}

const ShipIcon: React.FC<ShipIcon> = props => {
  const classes = useStyles()
  const { statKey } = props
  let image
  try {
    image = require(`../images/icons/${statKey}.png`)
  } catch (error) {
    console.log(error)
  }
  const stat = statKeys.find(({ key }) => key === statKey)
  let label: string | number
  if (props.label) {
    label = props.label
  } else {
    label = stat ? stat.name : statKey
  }
  return (
    <div className={classes.root}>
      <img className={classes.icon} src={image} />
      <Typography className={classes.statKey}>{label}</Typography>
    </div>
  )
}

export default ShipIcon
