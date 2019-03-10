import { Proficiency } from 'kc-calculator/dist/objects/Equipment'
import React from 'react'
import range from 'lodash/range'

import Typography from '@material-ui/core/Typography'
import cyan from '@material-ui/core/colors/cyan'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    position: 'relative'
  },
  image: {
    maxHeight: 24
  },
  value: {
    position: 'absolute',
    fontSize: 10,
    bottom: -8,
    right: -2
  }
})

type ProficiencyIconProps = {
  internal?: number
  level?: number
} & JSX.IntrinsicElements['div']

const ProficiencyIcon: React.FC<ProficiencyIconProps> = ({ internal, level = 0, ...rootProps }) => {
  const classes = useStyles()
  if (internal) {
    level = Proficiency.internalToLevel(internal)
  } else {
    internal = Proficiency.internalBounds[level]
  }
  return (
    <div {...rootProps}>
      <div className={classes.root}>
        <img className={classes.image} src={require(`../images/icons/proficiency${level}.png`)} />
        <Typography className={classes.value}>{internal}</Typography>
      </div>
    </div>
  )
}

export default ProficiencyIcon
