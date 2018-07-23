import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'

const styles = theme => ({
  buttom: {
    margin: theme.spacing.unit
  }
})

const DeleteButton = ({ classes, onClick }) => {
  return (
    <IconButton className={classes.button} onClick={onClick}>
      <Delete />
    </IconButton>
  )
}

DeleteButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func
}

export default withStyles(styles)(DeleteButton)
