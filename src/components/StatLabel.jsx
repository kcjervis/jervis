import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import statKeys from '../data/statKeys'

const styles = theme => ({
  root: { display: 'flex', alignItems: 'center' },
  image: {
    margin: 5,
    filter: 'invert(100%) brightness(120%)'
  }
})

const StatIcon = ({ name, classes }) => {
  const stat = statKeys.find(({ key }) => key === name)
  const label = stat ? stat.name : name
  try {
    const image = require(`../images/icons/${name}.png`)
    return <img className={classes.image} src={image} title={label} />
  } catch (error) {
    return <Typography> {label}</Typography>
  }
}

const StatLabel = ({ statName, value, classes }) => {
  return (
    <div className={classes.root}>
      <StatIcon name={statName} classes={classes} />
      <Typography> {String(value)}</Typography>
    </div>
  )
}

StatLabel.propTypes = {
  statName: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(StatLabel)
