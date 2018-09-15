import React from 'react'

import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import statKeys from '../data/statKeys'

const styles: StyleRulesCallback = theme => ({
  root: { display: 'flex', alignItems: 'center' },
  image: {
    margin: 5,
    filter: 'brightness(150%)'
  }
})

interface IStatLabelProps extends WithStyles {
  statName: string
  value: number | string
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
    <div className={classes.root}>
      <img className={classes.image} src={image} />
      <Typography>
        {label} {value}
      </Typography>
    </div>
  )
}

export default withStyles(styles)(StatLabel)
