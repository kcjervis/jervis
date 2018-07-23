import React, { Component } from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import BottomNavigation from '@material-ui/core/ButtonBase'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'

import equipments from '../utils/equipments'
import iconIdToTypes from '../utils/iconIdToTypes'

import { actions as entitiesActions } from '../redux/modules/entities'

const SelectVisibleTypesButton = ({ iconId, setIconId }) => {
  return (
    <Button onClick={() => setIconId(iconId)}>
      {iconId === 'other' ? (
        '他'
      ) : (
        <img src={require(`../images/equipments/icons/${iconId}.png`)} />
      )}
    </Button>
  )
}

const SelectEquipmentButton = ({ equipment, selectEquipment }) => {
  const handleClick = () => {
    selectEquipment(equipment)
  }
  return (
    <Button style={{ textTransform: 'none' }} onClick={handleClick}>
      {equipment.name}
    </Button>
  )
}

class EquipmentsPage extends Component {
  state = { iconId: 1, isAbysall: false }
  setIconId = iconId => this.setState({ iconId })
  setVisibleTypes = visibleTypes => this.setState({ visibleTypes })
  selectEquipment = ({ id }) => {
    const { history, location, setEquipment } = this.props
    if (!location.state) return null
    const { shipsId, index } = location.state
    if (!shipsId && !index) return null
    setEquipment({ shipsId, index, id })
    history.go(-1)
  }
  render() {
    const { iconId, isAbysall } = this.state
    const iconIds = Object.keys(iconIdToTypes)
    const visibleTypes = iconIdToTypes[iconId]
    const visibleEquipments = Object.values(equipments).filter(
      ({ types, id }) =>
        visibleTypes.includes(types[2]) && isAbysall ^ (id < 500)
    )
    return (
      <Paper>
        <Checkbox
          onClick={() =>
            this.setState(({ isAbysall }) => ({ isAbysall: !isAbysall }))
          }
        />
        <div>
          {iconIds.map(iconId => (
            <SelectVisibleTypesButton
              key={iconId}
              iconId={iconId}
              setIconId={this.setIconId}
            />
          ))}
        </div>
        {visibleEquipments.map((equipment, index) => (
          <SelectEquipmentButton
            key={index}
            equipment={equipment}
            selectEquipment={this.selectEquipment}
          />
        ))}
      </Paper>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  setEquipment: payload => dispatch(entitiesActions.setEquipment(payload))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentsPage)
