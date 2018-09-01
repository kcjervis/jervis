import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

import ProficiencyIcon from './ProficiencyIcon'

const styles = theme => ({
  root: {
    minWidth: 0,
    minHeight: 0
  }
})

const ImprovementButton = ({ improvement, onClick, classes }) => {
  return (
    <Button className={classes.root} onClick={onClick} size="small">
      {'★' + improvement}
    </Button>
  )
}

ProficiencyIcon.propTypes = {
  improvement: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ImprovementButton)
