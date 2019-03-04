import { Proficiency } from 'kc-calculator/dist/objects/Equipment'
import React from 'react'

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
      position: 'relative',
      marginTop: 2
    },
    value: {
      position: 'absolute',
      fontSize: 10,
      bottom: 0,
      right: -2
    }
  })

interface ProficiencyIconProps extends WithStyles<typeof styles> {
  type?: 'internal' | 'level'
  value: number
  className?: string
  style?: React.CSSProperties
}

const ProficiencyIcon: React.FC<ProficiencyIconProps> = ({ type = 'internal', value, classes, className, style }) => {
  let level: number
  let internal: number | undefined
  if (type === 'level') {
    level = value
  } else {
    internal = value
    level = Proficiency.internalToLevel(internal)
  }
  return (
    <div className={className} style={style}>
      <div className={classes.root}>
        <img src={require(`../images/icons/proficiency${level}.png`)} />
        {type === 'internal' && <Typography className={classes.value}>{internal}</Typography>}
      </div>
    </div>
  )
}

export default withStyles(styles)(ProficiencyIcon)
