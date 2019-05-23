import { observer } from 'mobx-react-lite'
import React, { useContext, useMemo } from 'react'
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
      height: '80vh'
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
    drop: (dragItem: any) => {
      store.set(index, dragItem.ship)
      dragItem.store.set(dragItem.index, ship)
    }
  })

  const opacity = isDragging ? 0 : 1

  const createShip = (data: IShipDataObject) => {
    store.createShip(index, data)
    dialogProps.onClose()
  }

  let element: JSX.Element
  if (!ship) {
    element = (
      <Button className={classes.width} variant="outlined" fullWidth size="large" onClick={onOpen}>
        <Add />
        艦娘{index + 1}
      </Button>
    )
  } else {
    element = (
      <ShipCard
        className={classes.width}
        ship={ship}
        defaultStatsExpanded={settingStore.operationPage.visibleShipStats}
        onUpdate={onOpen}
      />
    )
  }

  return (
    <div className={classes.root} ref={dndRef} style={{ opacity }}>
      {element}
      <Dialog fullWidth maxWidth="xl" classes={{ paper: classes.dialogPaper }} {...dialogProps}>
        <ShipSelectPanel onSelect={createShip} />
      </Dialog>
    </div>
  )
}

export default observer(ShipForm)
