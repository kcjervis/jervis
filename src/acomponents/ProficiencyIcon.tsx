import React from 'react'

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
      position: 'relative',
      margin: 5
    },
    value: {
      position: 'absolute',
      fontSize: 10,
      bottom: 0,
      right: -5
    }
  })

interface IProficiency {
  internal?: number
  level: number
}

interface IProficiencyIconProps extends WithStyles<typeof styles> {
  proficiency: IProficiency
}

const ProficiencyIcon: React.SFC<IProficiencyIconProps> = ({ proficiency, classes }) => {
  return (
    <div className={classes.root}>
      <img src={require(`../images/icons/proficiency${proficiency.level}.png`)} />
      {proficiency.internal && <Typography className={classes.value}>{proficiency.internal}</Typography>}
    </div>
  )
}

export default withStyles(styles)(ProficiencyIcon)
