import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux'

import { withStyles } from '@material-ui/core/styles'

import ShipCard from './ShipCard'
import { actions as entitiesActions } from '../redux/modules/entities'

const styles = theme => ({
  root: {}
})

const FleetPage = ({ fleetsId, fleet, classes }) => {
  return (
    <div>
      {fleet
        .get('ships')
        .map((shipsId, index) => (
          <ShipCard
            key={index}
            fleetsId={fleetsId}
            shipsId={shipsId}
            index={index}
          />
        ))}
    </div>
  )
}

const mapStateToProps = ({ entities }, { fleetsId }) => ({
  fleet: entities.getIn(['fleets', fleetsId])
})

const mapDispatchToProps = dispatch => ({
  entitiesActions: bindActionCreators(entitiesActions, dispatch),
  routerActions: bindActionCreators(routerActions, dispatch)
})

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FleetPage)
)
