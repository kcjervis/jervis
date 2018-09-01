import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

const styles = theme => ({
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

const ProficiencyIcon = ({ internalProficiency, classes }) => {
  const borders = [10, 25, 40, 55, 70, 85, 100]
  const level = borders.filter(border => internalProficiency >= border).length
  return (
    <div className={classes.root}>
      <img src={require(`../images/icons/proficiency${level}.png`)} />
      <Typography className={classes.value}>{internalProficiency}</Typography>
    </div>
  )
}

ProficiencyIcon.propTypes = {
  internalProficiency: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProficiencyIcon)
