import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import Typography from '@material-ui/core/Typography'

import { actions } from '../redux/modules/orm'

import ProficiencyIcon from '../components/ProficiencyIcon'
import ProficiencyButton from '../components/ProficiencyButton'
import StatLabel from '../components/StatLabel'
import {
  UpdateButton,
  RemoveButton,
  CloseButton
} from '../components/IconButtons'

import statKeys from '../data/statKeys'

const displayedStatNames = [
  'firepower',
  'torpedo',
  'antiAir',
  'armor',
  'asw',
  'evasion',
  'los',
  'luck',
  'speed',
  'range',
  'antiBomber',
  'interception',
  'types',
  'improvement',
  'internalProficiency'
]

const styles = theme => ({
  root: {
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.7)'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  details: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  improvements: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  improvement: {
    minWidth: 0
  }
})

const EquipmentCard = ({
  equipment,
  onClose,
  removeEquipment,
  updateImprovement,
  updateProficiency,
  history,
  classes
}) => {
  const isEquipmentsPage = history.location.pathname === '/equipments'
  const visibleInterface = !isEquipmentsPage

  const { id, masterId, name, improvement, internalProficiency } = equipment
  const proficiencies = [0, 10, 25, 40, 55, 70, 85, 100, 120]
  const improvements = Array.from({ length: 11 }, (_, k) => k)
  return (
    <Card className={classes.root} elevation={12}>
      {visibleInterface && (
        <div className={classes.buttons}>
          <RemoveButton onClick={removeEquipment} />
          <UpdateButton onClick={() => history.push('./equipments', { id })} />
          <CloseButton onClick={onClose} />
        </div>
      )}

      <Typography align="center" variant="headline">
        ID
        {masterId} {name}
      </Typography>

      <div className={classes.details}>
        <CardContent>
          {displayedStatNames.map(name => {
            const value = equipment[name]
            if (!value) {
              return null
            }
            if (name === 'internalProficiency' && value) {
              return <ProficiencyIcon key={name} internalProficiency={value} />
            }
            return <StatLabel key={name} statName={name} value={value} />
          })}
        </CardContent>
        <img
          src={equipment.image.itemOn}
          style={{
            maxWidth: 300,
            height: 'auto'
          }}
        />
      </div>

      {visibleInterface && (
        <div className={classes.improvements}>
          {improvements.map(value => (
            <Button
              key={value}
              className={classes.improvement}
              onClick={() => updateImprovement(value)}
              size="small"
            >
              {'★' + value}
            </Button>
          ))}
        </div>
      )}

      {internalProficiency >= 0 &&
        proficiencies.map(value => (
          <ProficiencyButton
            key={value}
            internalProficiency={value}
            onClick={() => updateProficiency(value)}
          />
        ))}
    </Card>
  )
}

EquipmentCard.propTypes = {
  equipment: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,

  onClose: PropTypes.func,
  removeEquipment: PropTypes.func,
  updateImprovement: PropTypes.func,
  updateProficiency: PropTypes.func
}

const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = (dispatch, { equipment }) => ({
  removeEquipment() {
    dispatch(actions.removeEquipment(equipment.id))
  },
  updateImprovement(improvement) {
    const { id } = equipment
    dispatch(actions.updateEquipment({ id, improvement }))
  },
  updateProficiency(internalProficiency) {
    const { id } = equipment
    dispatch(actions.updateEquipment({ id, internalProficiency }))
  }
})

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EquipmentCard)
