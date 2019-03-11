import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import statKeys from '../data/statKeys'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(1)
  },
  avatar: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  image: {
    filter: 'brightness(150%)'
  }
}))

interface StatChipProps {
  statKey: string
  value: number | string | [number, number]
}

const StatChip: React.FC<StatChipProps> = ({ statKey, value }) => {
  const classes = useStyles()
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

export default StatChip
