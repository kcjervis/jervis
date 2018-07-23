import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'

import EquipmentCard from './EquipmentCard'

import { actions as entitiesActions } from '../redux/modules/entities'
import selectors from '../redux/modules/entities/selectors'
import withDragAndDrop from '../hocs/withDragAndDrop'

const styles = theme => ({
  card: {
    height: 100,
    padding: theme.spacing.unit,
    margin: theme.spacing.unit
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    paddingBottom: theme.spacing.unit,
    '&:last-child': {
      paddingBottom: 0
    }
  }
})

const ShipStats = ({ ship }) => {
  const statNames = [
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
  return statNames.map(name => (
    <span key={name}>
      <img
        src={require(`../images/icons/${name}.png`)}
        style={{ filter: 'invert(100%) brightness(120%)' }}
      />
    </span>
  ))
}

const ShipCard = ({ fleetsId, index, shipsId, ship, classes, history }) => {
  if (!shipsId) {
    const setShipCard = () => {
      history.push('/ships', { fleetsId, index })
    }
    return (
      <Button
        variant="outlined"
        fullWidth
        size="large"
        className={classes.card}
        onClick={setShipCard}
      >
        <Add />
        艦娘
      </Button>
    )
  }
  const { name, slots, equipments, expansionEquipment } = ship
  return (
    <Card className={classes.card}>
      <CardContent className={classes.flexContainer}>
        <img src={ship.image.banner} />
        <Typography>{name}</Typography>
        <ShipStats ship={ship} />
      </CardContent>
      <CardContent className={classes.flexContainer}>
        {equipments.map((equipmentsId, index) => (
          <EquipmentCard
            key={index}
            shipsId={shipsId}
            equipmentsId={equipmentsId}
            index={index}
            slotSize={slots[index]}
          />
        ))}
        <EquipmentCard
          shipsId={shipsId}
          equipmentsId={expansionEquipment}
          index="expansionEquipment"
        />
      </CardContent>
    </Card>
  )
}

const mapStateToProps = (state, props) => ({
  ship: selectors.shipSelector(state, props)
})

const mapDispatchToProps = dispatch => ({
  entitiesActions: bindActionCreators(entitiesActions, dispatch),
  onEndDrag: payload => dispatch(entitiesActions.changeShipIndex(payload))
})

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withDragAndDrop('ShipCard')
)(ShipCard)
