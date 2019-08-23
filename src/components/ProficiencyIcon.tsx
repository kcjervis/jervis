import { Proficiency } from 'kc-calculator/dist/objects/Gear'
import React from 'react'
import clsx from 'clsx'

import Typography from '@material-ui/core/Typography'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

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
      background: 'rgba(128, 64, 64, 0.6)',
      borderRadius: 2
    }
  })
)

type ProficiencyIconProps = {
  internal?: number
  level?: number
} & JSX.IntrinsicElements['div']

const ProficiencyIcon = React.forwardRef<HTMLDivElement, ProficiencyIconProps>((props, ref) => {
  let { internal, level = 0, className, ...rootProps } = props
  const classes = useStyles()
  if (internal) {
    level = Proficiency.internalToLevel(internal)
  } else {
    internal = Proficiency.internalBounds[level]
  }
  return (
    <div className={clsx(classes.root, className)} {...rootProps} ref={ref}>
      <img className={classes.image} src={require(`../images/icons/proficiency${level}.png`)} />
      <Typography className={classes.value}>{internal}</Typography>
    </div>
  )
})

export default ProficiencyIcon
