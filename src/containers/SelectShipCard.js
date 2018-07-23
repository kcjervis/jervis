import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Button from '@material-ui/core/Button'

import { actions as entitiesActions } from '../redux/modules/entities'

const SelectShipCard = withRouter(({ ship, setShip, history, location }) => {
  let shipImage
  try {
    shipImage = require(`../images/ships/banner/${ship.id}.png`)
  } catch (error) {
    console.log('画像無し:' + ship.name)
  }
  const handleClick = () => {
    console.log(location.state, history.location.pathname)
    if (!location.state) return false
    const { fleetsId, index } = location.state
    setShip({ fleetsId, index, ship })
    history.go(-1)
  }
  return (
    <Button onClick={handleClick}>
      <img src={shipImage} />
    </Button>
  )
})

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = dispatch => ({
  setShip: payload => dispatch(entitiesActions.setShip(payload))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectShipCard)
