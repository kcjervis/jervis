import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'

import statKeys from '../data/statKeys'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing.unit * 0.5
    },
    avatar: {
      backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    image: {
      filter: 'brightness(150%)'
    }
  })

interface IStatLabelProps extends WithStyles<typeof styles> {
  statName: string
  value: number | string | [number, number]
}

const StatLabel: React.SFC<IStatLabelProps> = ({ statName, value, classes }) => {
  const stat = statKeys.find(({ key }) => key === statName)
  const label = stat ? stat.name : statName

  let image
  if (statName !== 'typeIds') {
    try {
      image = require(`../images/icons/${statName}.png`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Chip
      className={classes.root}
      avatar={<Avatar className={classes.avatar} imgProps={{ className: classes.image }} src={image} />}
      label={`${label} ${value}`}
      variant="outlined"
    />
  )
}

export default withStyles(styles)(StatLabel)
