import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'

import Popper from '@material-ui/core/Popper'
import Fade from '@material-ui/core/Fade'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import EquipmentCard from './EquipmentCard'
import ProficiencyIcon from '../components/ProficiencyIcon'
import AddEquipmentButton from '../components/AddEquipmentButton'

import { actions, selectors } from '../redux/modules/orm'
import withDragAndDrop from '../hocs/withDragAndDrop'

const styles = theme => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    '&:hover': {
      filter: 'brightness(120%)'
    }
  },
  typography: {
    fontSize: 12
  }
})

class EquipmentLabel extends React.Component {
  state = { open: false, anchorEl: null }
  handleClick = ({ currentTarget }) =>
    this.setState({ open: true, anchorEl: currentTarget })
  handleClose = () => this.setState({ open: false, anchorEl: null })

  render() {
    const {
      equipmentId,
      shipId,
      landBasedAirCorpsId,
      index,
      slotSize,
      equipment,
      classes,
      className
    } = this.props
    if (!equipment) {
      return (
        <div>
          <AddEquipmentButton
            className={className}
            shipId={shipId}
            landBasedAirCorpsId={landBasedAirCorpsId}
            index={index}
            slotSize={slotSize}
          />
        </div>
      )
    }

    const { open, anchorEl } = this.state
    const { improvement = 0, internalProficiency } = equipment
    return (
      <div className={className}>
        <Card className={classes.card} elevation={0} onClick={this.handleClick}>
          <img src={equipment.image.icon} />
          <Typography className={classes.typography}>
            {equipment.name}
          </Typography>
          <div style={{ display: 'flex', marginLeft: 'auto' }}>
            {internalProficiency >= 0 && (
              <ProficiencyIcon internalProficiency={internalProficiency} />
            )}
            <div style={{ margin: 5 }}>
              <Typography className={classes.typography}>
                {'★' + improvement}
              </Typography>
              <Typography className={classes.typography}>{slotSize}</Typography>
            </div>
          </div>
        </Card>
        <Popper
          id={open ? 'simple-popper' : null}
          open={open}
          anchorEl={anchorEl}
          transition
        >
          {({ TransitionProps }) => (
            <ClickAwayListener onClickAway={this.handleClose}>
              <Fade {...TransitionProps} timeout={500}>
                <div>
                  <EquipmentCard
                    equipment={equipment}
                    slotSize={slotSize}
                    onClose={this.handleClose}
                  />
                </div>
              </Fade>
            </ClickAwayListener>
          )}
        </Popper>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  equipment: selectors
    .equipmentSelector(state)
    .find(({ id }) => id === props.equipmentId)
})

const mapDispatchToProps = dispatch => ({
  onEndDrag({ dragProps, dropProps }) {
    const dragId = dragProps.equipmentId
    const dropId = dropProps.equipmentId
    if (dragId === dropId) { return false }
    let { shipId, landBasedAirCorpsId, index } = dropProps
    dispatch(
      actions.updateEquipment({
        id: dragId,
        shipId,
        landBasedAirCorpsId,
        index
      })
    )
    ;({ shipId, landBasedAirCorpsId, index } = dragProps)
    dispatch(
      actions.updateEquipment({
        id: dropId,
        shipId,
        landBasedAirCorpsId,
        index
      })
    )
  }
})

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withDragAndDrop('EquipmentLabel')
)(EquipmentLabel)
