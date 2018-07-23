import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { withStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import { actions as entitiesActions } from '../redux/modules/entities'
import selectors from '../redux/modules/entities/selectors'
import withDragAndDrop from '../hocs/withDragAndDrop'

const styles = theme => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    width: `15vw`,
    height: 50,
    marginLeft: theme.spacing.unit
  },
  typography: {
    fontSize: 12
  }
})

const EquipmentPopover = ({ anchorEl, classes, onClose }) => {
  return (
    <Popover open={Boolean(anchorEl)} onClose={onClose} anchorEl={anchorEl}>
      <Typography className={classes.typography}>
        The content of the Popover.
      </Typography>
    </Popover>
  )
}

const mapStateToProps = (state, props) => ({
  equipment: selectors.equipmentSelector(state, props)
})

const mapDispatchToProps = dispatch => ({
  entitiesActions: bindActionCreators(entitiesActions, dispatch),
  onEndDrag: payload => dispatch(entitiesActions.changeEquipmentIndex(payload))
})

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EquipmentPopover)
