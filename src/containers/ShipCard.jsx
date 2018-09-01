import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import EquipmentLabel from './EquipmentLabel'
import AddShipButton from '../components/AddShipButton'
import { RemoveButton } from '../components/IconButtons'

import withDragAndDrop from '../hocs/withDragAndDrop'
import { actions, selectors } from '../redux/modules/orm'

const styles = theme => ({
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

const ShipCard = ({ fleetId, index, shipId, ship, classes, removeShip }) => {
  if (!ship) {
    return <AddShipButton fleetId={fleetId} index={index} />
  }
  const { name, slots, image, equipments, expansionEquipment } = ship
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
            shipId={shipId}
            equipmentId={equipment && equipment.id}
            index={index}
            slotSize={slots[index]}
          />
        ))}
        <EquipmentLabel
          className={classes.flexContent}
          shipId={shipId}
          equipmentId={expansionEquipment && expansionEquipment.id}
          index="expansionEquipment"
        />
      </CardContent>
      <CardContent className={classes.flexContainer}>
        <Typography>{name}</Typography>
        {displayedStatNames.map(name => (
          <div key={name} className={classes.stat}>
            <img
              key={name}
              src={require(`../images/icons/${name}.png`)}
              style={{ filter: 'invert(100%) brightness(120%)' }}
            />
            <Typography>{15}</Typography>
          </div>
        ))}
        <RemoveButton onClick={() => removeShip(shipId)} />
      </CardContent>
    </Card>
  )
}

const mapStateToProps = (state, props) => ({
  ship: selectors.shipSelector(state).find(({ id }) => id === props.shipId)
})

const mapDispatchToProps = dispatch => ({
  removeShip: payload => dispatch(actions.removeShip(payload)),
  onEndDrag({ dragProps, dropProps }) {
    const dragId = dragProps.shipId
    const dropId = dropProps.shipId
    if (dragId === dropId) {
      return false
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

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withDragAndDrop('ShipCard')
)(ShipCard)
