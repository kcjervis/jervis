import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { IShipDataObject } from 'kc-calculator'

import { Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'
import { makeStyles, createStyles } from '@material-ui/styles'
import Dialog from '@material-ui/core/Dialog'

import { ObservableFleet, ObservableShip, SettingStoreContext } from '../../stores'
import ShipCard from './ShipCard'
import { useOpen, useDragAndDrop } from '../../hooks'
import ShipSelectPanel from '../ShipSelectPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 4
    },
    width: {
      width: 8 * 32
    },
    dialogPaper: {
      minHeight: '80vh'
    }
  })
)

interface ShipFormProps {
  ship?: ObservableShip
  store: ObservableFleet
  index: number
}

const ShipForm: React.FC<ShipFormProps> = props => {
  const { ship, store, index } = props
  const settingStore = useContext(SettingStoreContext)

  const classes = useStyles()
  const { onOpen, ...dialogProps } = useOpen()
  const [{ isDragging }, dndRef] = useDragAndDrop({
    item: { type: 'Ship', ship, store, index },
    drop: dragItem => {
      store.set(index, dragItem.ship)
      dragItem.store.set(dragItem.index, ship)
    }
  })

  const opacity = isDragging ? 0 : 1

  const createShip = (data: IShipDataObject) => {
    store.createShip(index, data)
    dialogProps.onClose()
  }

  const dialog = (
    <Dialog fullWidth maxWidth="xl" {...dialogProps} classes={{ paper: classes.dialogPaper }}>
      <ShipSelectPanel onSelect={createShip} />
    </Dialog>
  )

  if (!ship) {
    return (
      <div className={classes.root} ref={dndRef} style={{ opacity }}>
        <Button className={classes.width} variant="outlined" fullWidth size="large" onClick={onOpen}>
          <Add />
          艦娘{index + 1}
        </Button>

        {dialog}
      </div>
    )
  }

  return (
    <div className={classes.root} ref={dndRef} style={{ opacity }}>
      <ShipCard
        className={classes.width}
        ship={ship}
        defaultStatsExpanded={settingStore.operationPage.visibleShipStats}
        onUpdate={onOpen}
      />
      {dialog}
    </div>
  )
}

export default observer(ShipForm)
