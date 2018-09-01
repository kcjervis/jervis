import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { RemoveButton } from '../components/IconButtons'
import EquipmentLabel from './EquipmentLabel'

import withDragAndDrop from '../hocs/withDragAndDrop'
import { actions, selectors } from '../redux/modules/orm'
import { RootState } from '../types'

const styles: StyleRulesCallback = theme => ({
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

interface IShipPlateProps extends WithStyles {
  ship: {
    id: number
    equipments: any[]
    [index: string]: any
  }
  removeShip: (id: number) => void
}

/**
 * 編成ページの艦娘UI
 */
const ShipPlate: React.SFC<IShipPlateProps> = ({ ship, classes, removeShip }) => {
  const { name, slots, image, equipments, expansionEquipment } = ship
  const handleRemove = () => {
    removeShip(ship.id)
  }
  return (
    <Card className={classes.card}>
      <CardContent className={classes.flexContainer}>
        <div className={classes.flexContent}>
          <img src={image.banner} />
        </div>
        {equipments.map((equipment, index) => (
          <EquipmentLabel
            key={index}
            className={classes.flexContent}
            shipId={ship.id}
            equipmentId={equipment && equipment.id}
            index={index}
            slotSize={slots[index]}
          />
        ))}
        <EquipmentLabel
          className={classes.flexContent}
          shipId={ship.id}
          equipmentId={expansionEquipment && expansionEquipment.id}
          index="expansionEquipment"
        />
      </CardContent>
      <CardContent className={classes.flexContainer}>
        <Typography>{name}</Typography>
        {displayedStatNames.map(statName => (
          <div key={statName} className={classes.stat}>
            <img src={require(`../images/icons/${statName}.png`)} style={{ filter: 'invert(100%) brightness(120%)' }} />
            <Typography>{15}</Typography>
          </div>
        ))}
        <RemoveButton onClick={handleRemove} />
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
  ship: selectors.shipSelector(state).find(({ id }: { id: number }) => id === props.shipId)
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

const Styled = withStyles(styles)(ShipPlate)
const WithDragAndDrop = withDragAndDrop('ShipPlate')(Styled)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithDragAndDrop)
