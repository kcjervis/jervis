import { Proficiency } from 'kc-calculator/dist/objects/Equipment'
import React from 'react'
import range from 'lodash/range'

import Typography from '@material-ui/core/Typography'
import cyan from '@material-ui/core/colors/cyan'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      bottom: 0,
      right: 0,
      lineHeight: 1,
      background: 'rgba(128, 64, 64, 0.8)',
      borderRadius: 2
    }
  })
)

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
