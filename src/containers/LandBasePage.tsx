import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'

import { LandBasedAirCorpsModel } from '../calculator'
import LandBasedFleetCard, { ILandBasedAirCorpsCardProps } from '../components/LandBasedAirCorpsCard'
import { actions, selectors } from '../redux/modules/orm'
import { RootState } from '../types'

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around'
  }
})

interface ILandBasePageProps extends WithStyles {
  landBase: LandBasedAirCorpsModel[]
  onEndDrag: (...args: any[]) => void
}

const LandBasePage: React.SFC<ILandBasePageProps> = ({ landBase, classes, onEndDrag }) => {
  return (
    <div className={classes.root}>
      {landBase.map(airCorps => (
        <LandBasedFleetCard
          key={airCorps.id}
          landBasedAirCorps={airCorps}
          index={airCorps.index}
          onEndDrag={onEndDrag}
        />
      ))}
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onEndDrag({
    dragProps,
    dropProps
  }: {
    dragProps: ILandBasedAirCorpsCardProps
    dropProps: ILandBasedAirCorpsCardProps
  }) {
    const dragId = dragProps.landBasedAirCorps.id
    const dropId = dropProps.landBasedAirCorps.id
    if (dragId === dropId) {
      return
    }
    if (typeof dragId === 'number') {
      const { index } = dropProps.landBasedAirCorps
      dispatch(
        actions.updateLandBasedAirCorps({
          id: dragId,
          index
        })
      )
    }
    if (typeof dropId === 'number') {
      const { index } = dragProps.landBasedAirCorps
      dispatch(
        actions.updateLandBasedAirCorps({
          id: dropId,
          index
        })
      )
    }
  }
})

const WithStyles = withStyles(styles)(LandBasePage)
export default connect(
  null,
  mapDispatchToProps
)(WithStyles)
