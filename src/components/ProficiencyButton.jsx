import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

import ProficiencyIcon from './ProficiencyIcon'

const styles = theme => ({
  root: {
    minWidth: 0,
    minHeight: 0,
    '&:hover': {
      filter: 'brightness(150%)'
    }
  }
})

const ProficiencyButton = ({ internalProficiency, onClick, classes }) => {
  return (
    <Button className={classes.root} onClick={onClick} size="small">
      <ProficiencyIcon internalProficiency={internalProficiency} />
    </Button>
  )
}

ProficiencyButton.propTypes = {
  internalProficiency: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProficiencyButton)
