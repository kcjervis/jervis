import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'

import { RemoveButton } from '../components/IconButtons'
import ShipBanner from '../components/ShipBanner'
import StatLabel from '../components/StatLabel'
import EquipmentLabel from './EquipmentLabel'

import { ShipModel } from '../calculator'
import withDragAndDrop from '../hocs/withDragAndDrop'
import { actions, selectors } from '../redux/modules/orm'
import { RootState } from '../types'

const styles: StyleRulesCallback = theme => ({
  addShipButton: {
    margin: theme.spacing.unit,
    minHeight: 80
  },
  card: {
    padding: theme.spacing.unit,
    margin: theme.spacing.unit
  },
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 0,
    paddingBottom: theme.spacing.unit,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  flexContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 0.5,
    width: `12vw`,
    minWidth: 200,
    height: 50
  },
  stat: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: theme.spacing.unit
  },
  statImage: {
    flexGrow: 0
  }
})

interface IShipPlateProps extends WithStyles, RouteComponentProps<{}> {
  ship?: ShipModel
  fleetId: number
  index: number
  removeShip: (id: number) => void
}

/**
 * 編成ページの艦娘UI
 */
const ShipPlate: React.SFC<IShipPlateProps> = ({ ship, fleetId, index, classes, removeShip, history }) => {
  const handleAddShip = () => {
    history.push('/ships', { fleetId, index })
  }
  if (!ship) {
    return (
      <Button
        className={classes.addShipButton}
        variant="outlined"
        fullWidth={true}
        size="large"
        onClick={handleAddShip}
      >
        <Add />
        艦娘
      </Button>
    )
  }
  const { name, slots, equipments } = ship

  const handleRemove = () => {
    if (typeof ship.id === 'number') {
      removeShip(ship.id)
    }
  }

  const displayedStats = {
    firepower: ship.firepower,
    torpedo: ship.torpedo,
    antiAir: ship.antiAir,
    armor: ship.armor,
    asw: ship.asw,
    los: ship.los,
    evasion: ship.evasion
  }

  return (
    <Card className={classes.card}>
      <CardContent className={classes.flexContainer}>
        <div className={classes.flexContent}>
          <ShipBanner masterId={ship.masterId} />
        </div>
        <Typography>{name}</Typography>

        {/* 艦娘ステータス */}
        {Object.entries(displayedStats).map(([key, value]) => (
          <StatLabel key={key} statName={key} value={value} />
        ))}
        <RemoveButton onClick={handleRemove} />
      </CardContent>

      <CardContent className={classes.flexContainer}>
        {ship.getDisplayedEquipments().map((equipment, equipIndex) => (
          <EquipmentLabel
            key={equipIndex}
            className={classes.flexContent}
            equipmentId={equipment && equipment.id}
            shipId={ship.id}
            index={equipIndex}
            slotSize={slots[equipIndex]}
            isReinforceExpansion={equipIndex + 1 > slots.length}
          />
        ))}
      </CardContent>
    </Card>
  )
}

interface IShipPlateConnectedProps {
  shipId?: number
  fleetId: number
  index: number
}

const mapStateToProps = (state: RootState, props: IShipPlateConnectedProps) => ({
  ship: selectors.shipSelector(state, props)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  removeShip: (id: number) => dispatch(actions.removeShip(id)),
  onEndDrag({ dragProps, dropProps }: { dragProps: IShipPlateConnectedProps; dropProps: IShipPlateConnectedProps }) {
    const dragId = dragProps.shipId
    const dropId = dropProps.shipId
    if (dragId === dropId) {
      return
    }
    if (typeof dragId === 'number') {
      dispatch(
        actions.updateShip({
          id: dragId,
          fleetId: dropProps.fleetId,
          index: dropProps.index
        })
      )
    }
    if (typeof dropId === 'number') {
      dispatch(
        actions.updateShip({
          id: dropId,
          fleetId: dragProps.fleetId,
          index: dragProps.index
        })
      )
    }
  }
})

const WithRouter = withRouter(ShipPlate)
const WithStyles = withStyles(styles)(WithRouter)
const WithDragAndDrop = withDragAndDrop('ShipPlate')(WithStyles)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithDragAndDrop)
