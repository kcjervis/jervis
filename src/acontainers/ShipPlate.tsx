import { IShip } from 'kc-calculator'
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import * as selectors from '../redux/modules/selectors'
import { ShipRecord } from '../redux/modules/ships'
import { RootState } from '../types'

interface IShipPlate {
  shipRecord?: ShipRecord
  ship?: IShip
}

const ShipPlate: React.SFC<IShipPlate> = ({ shipRecord, ship }) => {
  if (!shipRecord) {
    return null
  }
  return <div>{shipRecord.id}</div>
}

interface IShipPlateConnected {
  shipId: string
}

const mapStateToProps = (state: RootState, props: IShipPlateConnected) => ({
  shipRecord: state.ships.find(({ id }) => id === props.shipId),
  ship: selectors.shipSelector(state, props)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShipPlate)
