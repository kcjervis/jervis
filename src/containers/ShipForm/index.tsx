import { observer } from 'mobx-react-lite'
import React from 'react'

import { Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'
import { makeStyles, createStyles } from '@material-ui/styles'
import Dialog from '@material-ui/core/Dialog'

import withDragAndDrop from '../../hocs/withDragAndDrop'

import { ObservableFleet, ObservableShip, WorkspaceStoreContext } from '../../stores'
import ShipCard from './ShipCard'
import { useOpen } from '../../hooks'
import ShipSelectPanel from '../ShipSelectPanel'
import { IShipDataObject } from 'kc-calculator'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 4
    },
    width: {
      width: 8 * 30
    },
    dialogPaper: {
      background: theme.palette.grey[800]
    }
  })
)

interface ShipForm {
  ship?: ObservableShip
  fleet: ObservableFleet
  index: number
  onEndDrag: (drag: any, drop: any) => void
}

const ShipForm: React.FC<ShipForm> = props => {
  const { ship, fleet, index } = props
  const classes = useStyles()
  const { onOpen, ...dialogProps } = useOpen()

  const createShip = (data: IShipDataObject) => {
    fleet.createShip(index, data)
    dialogProps.onClose()
  }

  const dialog = (
    <Dialog fullWidth maxWidth="xl" {...dialogProps} classes={{ paper: classes.dialogPaper }}>
      <ShipSelectPanel onSelect={createShip} />
    </Dialog>
  )

  if (!ship) {
    return (
      <div className={classes.root}>
        <Button className={classes.width} variant="outlined" fullWidth={true} size="large" onClick={onOpen}>
          <Add />
          艦娘{index + 1}
        </Button>

        {dialog}
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <ShipCard className={classes.width} ship={ship} fleet={fleet} onUpdate={onOpen} />
      {dialog}
    </div>
  )
}

export default withDragAndDrop('ShipForm')(observer(ShipForm))
