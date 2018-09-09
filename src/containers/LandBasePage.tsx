import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'

import LandBasedFleetCard, { IAirCorps, ILandBasedFleetCardProps } from '../components/LandBasedFleetCard'
import { actions, selectors } from '../redux/modules/orm'
import { RootState } from '../types'

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around'
  }
})

interface ILandBasePageProps extends WithStyles {
  airCorpsList: IAirCorps[]
  onEndDrag: (...args: any[]) => void
}

const LandBasePage: React.SFC<ILandBasePageProps> = ({ airCorpsList, classes, onEndDrag }) => {
  return (
    <div className={classes.root}>
      {airCorpsList.map(airCorps => (
        <LandBasedFleetCard
          key={`lbas${airCorps.id}`}
          airCorps={airCorps}
          index={airCorps.index}
          onEndDrag={onEndDrag}
        />
      ))}
    </div>
  )
}

interface ILandBasePageConnectedProps {
  operationId: number
}

const mapStateToProps = (state: RootState, props: ILandBasePageConnectedProps) => ({
  airCorpsList: selectors
    .landBasedAirCorpsListSelector(state)
    .filter(airCorps => airCorps.operationId === props.operationId)
    .sort((a, b) => a.index - b.index)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onEndDrag({ dragProps, dropProps }: { dragProps: ILandBasedFleetCardProps; dropProps: ILandBasedFleetCardProps }) {
    const dragId = dragProps.airCorps.id
    const dropId = dropProps.airCorps.id
    if (dragId === dropId) {
      return
    }
    dispatch(
      actions.updateLandBasedAirCorps({
        id: dragId,
        operationId: dragProps.airCorps.operationId,
        index: dragProps.airCorps.index
      })
    )
    dispatch(
      actions.updateLandBasedAirCorps({
        id: dropId,
        operationId: dragProps.airCorps.operationId,
        index: dragProps.airCorps.index
      })
    )
  }
})

const WithStyles = withStyles(styles)(LandBasePage)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithStyles)
