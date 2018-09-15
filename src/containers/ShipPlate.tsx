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
import EquipmentLabel from './EquipmentLabel'

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
const displayedStatNames = [
  'hp',
  'firepower',
  'torpedo',
  'antiAir',
  'armor',
  'asw',
  'evasion',
  'los',
  'luck',
  'speed',
  'range'
]

interface IShipPlateProps extends WithStyles, RouteComponentProps<{}> {
  ship?: {
    id: number
    equipments: any[]
    [index: string]: any
  }
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
    removeShip(ship.id)
  }
  return (
    <Card className={classes.card}>
      <CardContent className={classes.flexContainer}>
        <div className={classes.flexContent}>
          <ShipBanner masterId={ship.masterId} />
        </div>
        <Typography>{name}</Typography>
        {displayedStatNames.map(statName => (
          <div key={statName} className={classes.stat}>
            <img src={require(`../images/icons/${statName}.png`)} style={{ filter: 'brightness(150%)' }} />
            <Typography>{15}</Typography>
          </div>
        ))}
        <RemoveButton onClick={handleRemove} />
      </CardContent>

      <CardContent className={classes.flexContainer}>
        {equipments.map((equipment, equipIndex) => (
          <EquipmentLabel
            key={equipIndex}
            className={classes.flexContent}
            shipId={ship.id}
            equipmentId={equipment && equipment.id}
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
  shipId: number
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
    dispatch(
      actions.updateShip({
        id: dragId,
        fleetId: dropProps.fleetId,
        index: dropProps.index
      })
    )
    dispatch(
      actions.updateShip({
        id: dropId,
        fleetId: dragProps.fleetId,
        index: dragProps.index
      })
    )
  }
})

const WithRouter = withRouter(ShipPlate)
const WithStyles = withStyles(styles)(WithRouter)
const WithDragAndDrop = withDragAndDrop('ShipPlate')(WithStyles)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithDragAndDrop)
