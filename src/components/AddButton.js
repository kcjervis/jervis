import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'

const styles = theme => ({
  buttom: {
    margin: theme.spacing.unit
  }
})

const AddButton = ({ classes, onClick }) => {
  return (
    <IconButton className={classes.button} onClick={onClick}>
      <Add />
    </IconButton>
  )
}

AddButton.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AddButton)
