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

interface IStatChipProps extends WithStyles<typeof styles> {
  statKey: string
  value: number | string | [number, number]
}

const StatChip: React.FC<IStatChipProps> = ({ statKey, value, classes }) => {
  const stat = statKeys.find(({ key }) => key === statKey)
  const label = stat ? stat.name : statKey

  let image
  if (!['typeIds'].includes(statKey)) {
    try {
      image = require(`../images/icons/${statKey}.png`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Chip
      className={classes.root}
      avatar={image && <Avatar className={classes.avatar} imgProps={{ className: classes.image }} src={image} />}
      label={`${label} ${value}`}
      variant="outlined"
    />
  )
}

export default withStyles(styles)(StatChip)
