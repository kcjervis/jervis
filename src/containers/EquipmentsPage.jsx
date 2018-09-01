import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import Fade from '@material-ui/core/Fade'

import EquipmentCard from './EquipmentCard'

import iconIdToTypes from '../data/iconIdToTypes'
import MasterData from '../data'
import { EquipmentModel } from '../calculator/models'

import { actions } from '../redux/modules/orm'

const styles = theme => ({
  equipmentButtons: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  equipmentButton: {
    width: 300
  }
})

class EquipmentsPage extends Component {
  state = { iconId: 1, visibleAbysall: false, anchorEl: null, equipment: null }

  baseEquipments = MasterData.equipments
    .map(equip => new EquipmentModel({ masterId: equip.id }))
    .sort((equip1, equip2) => equip1.iconId - equip2.iconId)

  setIconId = iconId => () => this.setState({ iconId })

  setVisibleTypes = visibleTypes => this.setState({ visibleTypes })

  toggleAbysall = () =>
    this.setState(({ visibleAbysall }) => ({ visibleAbysall: !visibleAbysall }))

  selectEquipment = equipment => () => {
    const { history, location, upsertEquipment } = this.props
    if (!location.state) { return false }

    const { masterId } = equipment
    const payload = { ...location.state, masterId }

    if (equipment.isAerialCombatPlane) { payload.internalProficiency = 120 }
    if (equipment.isAttacker || equipment.isBomber) {
      payload.internalProficiency = 100
    }
    upsertEquipment(payload)
    history.go(-1)
  }

  handleEquipmentCardOpen = equipment => event => {
    this.setState({ anchorEl: event.currentTarget, equipment })
  }

  handleEquipmentCardClose = () => {
    this.setState({ anchorEl: null, equipment: null })
  }

  render() {
    const { iconId, visibleAbysall, anchorEl, equipment } = this.state
    const { classes } = this.props

    const iconIds = Object.keys(iconIdToTypes)
    const visibleTypes = iconIdToTypes[iconId]
    const visibleEquipments = this.baseEquipments.filter(
      ({ categoryId, isAbysall }) =>
        visibleTypes.includes(categoryId) && visibleAbysall ^ !isAbysall
    )
    return (
      <Paper>
        <Checkbox onClick={this.toggleAbysall} />
        <div>
          {iconIds.map(iconId => (
            <Button key={iconId} onClick={this.setIconId(iconId)}>
              {iconId === 'other' ? (
                '他'
              ) : (
                <img
                  src={require(`../images/equipments/icons/${iconId}.png`)}
                />
              )}
            </Button>
          ))}
        </div>

        <div className={classes.equipmentButtons}>
          {visibleEquipments.map((equipment, index) => (
            <Button
              className={classes.equipmentButton}
              key={index}
              style={{ textTransform: 'none' }}
              onClick={this.selectEquipment(equipment)}
              onMouseEnter={this.handleEquipmentCardOpen(equipment)}
              onMouseLeave={this.handleEquipmentCardClose}
            >
              <img src={equipment.image.icon} />
              {equipment.name}
            </Button>
          ))}
        </div>
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          transition
          style={{
            pointerEvents: 'none'
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                {equipment && <EquipmentCard equipment={equipment} />}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Paper>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  upsertEquipment: payload => dispatch(actions.upsertEquipment(payload))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EquipmentsPage))
