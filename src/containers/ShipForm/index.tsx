import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/styles'

import withDragAndDrop from '../../hocs/withDragAndDrop'

import { ObservableFleet, ObservableShip } from '../../stores'
import ShipCard from './ShipCard'

const useStyles = makeStyles({
  root: {
    margin: 4
  },
  width: {
    width: 8 * 30
  }
})

interface ShipForm {
  ship?: ObservableShip
  fleet: ObservableFleet
  index: number
  onEndDrag: (drag: any, drop: any) => void
}

const ShipForm: React.FC<ShipForm> = props => {
  const { ship, fleet, index } = props
  const classes = useStyles()
  if (!ship) {
    return (
      <div className={classes.root}>
        <Button
          className={classes.width}
          href={`#/ships/${fleet.id}/${index}`}
          variant="outlined"
          fullWidth={true}
          size="large"
        >
          <Add />
          艦娘{index + 1}
        </Button>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <ShipCard className={classes.width} ship={ship} fleet={fleet} />
    </div>
  )
}

export default withDragAndDrop('ShipForm')(observer(ShipForm))
