import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

import EquipmentLabel from './EquipmentLabel'
import { actions, selectors } from '../redux/modules/orm'

import withDragAndDrop from '../hocs/withDragAndDrop'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  landBasedFleetCard: {
    width: '28vw',
    marginTop: theme.spacing.unit
  },
  equipmentLabel: {
    height: 70
  }
})

const LandBasedFleetCard = withDragAndDrop('LandBasedFleetCard')(
  ({ airCorps, classes }) => {
    return (
      <Card className={classes.landBasedFleetCard}>
        <Typography>{`第${airCorps.index + 1}航空隊`}</Typography>
        {airCorps.equipments.map((equip, index) => (
          <EquipmentLabel
            key={index}
            className={classes.equipmentLabel}
            landBasedAirCorpsId={airCorps.id}
            index={index}
            equipmentId={equip && equip.id}
            slotSize={18}
          />
        ))}
      </Card>
    )
  }
)

const LandBasePage = ({ operation, airCorpsList, classes, onEndDrag }) => {
  return (
    <div className={classes.root}>
      {airCorpsList.map(airCorps => (
        <LandBasedFleetCard
          classes={classes}
          key={`lbas${airCorps.id}`}
          airCorps={airCorps}
          onEndDrag={onEndDrag}
        />
      ))}
    </div>
  )
}

const mapStateToProps = (state, props) => ({
  airCorpsList: selectors
    .landBasedAirCorpsSelector(state)
    .filter(airCorps => airCorps.operationId === props.operation.id)
    .sort((a, b) => a.index - b.index)
})

const mapDispatchToProps = dispatch => ({
  onEndDrag({ dragProps, dropProps }) {
    const dragId = dragProps.airCorps.id
    const dropId = dropProps.airCorps.id
    if (dragId === dropId) { return false }
    let { operationId, index } = dropProps.airCorps
    dispatch(
      actions.updateLandBasedAirCorps({
        id: dragId,
        operationId,
        index
      })
    )
    ;({ operationId, index } = dragProps.airCorps)
    dispatch(
      actions.updateLandBasedAirCorps({
        id: dropId,
        operationId,
        index
      })
    )
  }
})

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LandBasePage)
