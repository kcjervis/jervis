import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ArrowBack from '@material-ui/icons/ArrowBack'

const styles = theme => ({
  buttom: {
    margin: theme.spacing.unit
  }
})

const BackButton = ({ classes }) => {
  return (
    <IconButton className={classes.button}>
      <ArrowBack />
    </IconButton>
  )
}

BackButton.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BackButton)
