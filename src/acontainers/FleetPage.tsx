import { IFleet } from 'kc-calculator'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import ShipPlate from './ShipPlate'

import { FleetRecord } from '../redux/modules/fleets'
import * as selectors from '../redux/modules/selectors'
import { RootState } from '../types'

interface IShipSpaceProps {
  shipId?: string
  toShipsPage: () => void
}

const ShipSpace: React.SFC<IShipSpaceProps> = ({ shipId, toShipsPage }) => {
  if (!shipId) {
    return <Button onClick={toShipsPage}>'追加'</Button>
  }
  return <ShipPlate shipId={shipId} />
}

const styles = (theme: Theme) => createStyles({})

interface IFleetPageProps extends WithStyles<typeof styles>, RouteComponentProps {
  fleetRecord?: FleetRecord
  fleet?: IFleet
}

const FleetPage: React.SFC<IFleetPageProps> = ({ fleet, fleetRecord, classes, history }) => {
  if (!fleetRecord) {
    return null
  }
  const toShipsPage = (index: number) => () => {
    history.push('ships', { fleetId: fleetRecord.id, index })
  }

  return (
    <div>
      {fleetRecord.ships.map((shipId, index) => (
        <ShipSpace key={index} shipId={shipId} toShipsPage={toShipsPage(index)} />
      ))}
    </div>
  )
}

const withStyle = withRouter(withStyles(styles)(FleetPage))

interface IFleetPageConnectedProps {
  fleetId: string
}

const mapStateToProps = (state: RootState, props: IFleetPageConnectedProps) => ({
  fleetRecord: state.fleets.find(({ id }) => id === props.fleetId),
  fleet: selectors.fleetSelector(state, props)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyle)
