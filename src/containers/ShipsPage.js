import React, { Component } from 'react'

import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'

import ships from '../utils/ships'
import shipClasses from '../utils/shipClasses'
import SelectShipCard from './SelectShipCard'

const SelectShipTypeButtonGroup = props => {
  const categories = [
    { name: '海防', types: [1] },
    { name: '駆逐', types: [2] },
    { name: '軽巡', types: [3] },
    { name: '雷巡', types: [4] },
    { name: '重巡', types: [5] },
    { name: '航巡', types: [6] },
    { name: '戦艦', types: [8, 9, 12] },
    { name: '航戦', types: [10] },
    { name: '軽空', types: [7] },
    { name: '正空', types: [11] },
    { name: '装空', types: [18] },
    { name: '潜水', types: [13, 14] },
    { name: '水母', types: [16] },
    { name: '他', types: [15, 17, 19, 20, 21, 22] }
  ]
  return categories.map(category => (
    <Button
      key={category.name}
      size="small"
      children={category.name}
      onClick={() => props.setTypes(category.types)}
    />
  ))
}

class ShipsPage extends Component {
  state = { visibleTypes: [11], isAbysall: false, isRemodel: true }
  render() {
    const { visibleTypes, isAbysall, isRemodel } = this.state
    const visibleShips = getVisibleShips(
      ships,
      visibleTypes,
      isAbysall,
      isRemodel
    )
    const setTypes = visibleTypes => {
      const newState = { ...this.state, visibleTypes }
      this.setState(newState)
    }
    return (
      <div>
        <Checkbox
          children="敵"
          onClick={() =>
            this.setState(state => ({ isAbysall: !state.isAbysall }))
          }
        />
        <SelectShipTypeButtonGroup setTypes={setTypes} />
        <ShipsList ships={visibleShips} />
      </div>
    )
  }
}

const getVisibleShips = (ships, types, isAbysall, isRemodel) => {
  const canRemodel = ship => 'remodel' in ship && 'next' in ship.remodel
  const canConvert = ship => {
    if (!canRemodel(ship)) return false
    const { prev, next } = ship.remodel
    if (prev === next) return true
    return ships[next].remodel.next === ship.id
  }
  return Object.values(ships).filter(ship => {
    if (isAbysall ^ (ship.id > 1500)) return false
    if (isRemodel) {
      if (canRemodel(ship)) {
        if (!canConvert(ship)) return false
      }
    }
    return types.includes(ship.type)
  })
}

const ShipsList = ({ ships }) => {
  const classes = {}
  for (const ship of ships) {
    if (!classes[ship.class]) {
      classes[ship.class] = []
    }
    classes[ship.class].push(ship)
  }
  return Object.entries(classes).map(shipClass => (
    <ClassPane key={shipClass[0]} classId={shipClass[0]} ships={shipClass[1]} />
  ))
}

const ClassPane = ({ classId, ships }) => {
  ships = ships.sort((a, b) => a.classNo - b.classNo)
  return (
    <div>
      <Typography>{shipClasses[classId]}</Typography>
      {ships.map(ship => <SelectShipCard key={ship.id} ship={ship} />)}
      <Divider />
    </div>
  )
}

export default ShipsPage
