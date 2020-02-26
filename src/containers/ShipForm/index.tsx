import { observer } from "mobx-react"
import React, { useContext } from "react"

import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Add from "@material-ui/icons/Add"
import { makeStyles } from "@material-ui/core/styles"

import { ObservableFleet, ObservableShip, SettingStoreContext, EnemyShipStore } from "../../stores"
import ShipCard from "./ShipCard"
import { useDragAndDrop } from "../../hooks"
import { ShipSelectPanelStateContext } from "../ShipSelectPanel"

const useStyles = makeStyles({
  root: { width: 8 * 60 }
})

interface ShipFormProps {
  ship?: ObservableShip
  store: ObservableFleet | EnemyShipStore
  index: number
}

const ShipForm: React.FC<ShipFormProps> = props => {
  const { ship, store, index } = props
  const shipSelect = useContext(ShipSelectPanelStateContext)
  const settingStore = useContext(SettingStoreContext)

  const classes = useStyles()
  const [dndProps, dndRef] = useDragAndDrop({
    item: { type: "Ship", ship, store, index },
    drop: dragItem => {
      store.set(index, dragItem.ship)
      dragItem.store.set(dragItem.index, ship)
    }
  })

  const handleOpen = () =>
    shipSelect.onOpen({
      onSelect: data => store.createShip(index, data)
    })

  let element: JSX.Element
  if (!ship) {
    element = (
      <Button variant="outlined" fullWidth size="large" onClick={handleOpen}>
        <Add />
        艦娘{index + 1}
      </Button>
    )
  } else {
    element = <ShipCard ship={ship} expanded={settingStore.operationPage.visibleShipStats} onUpdate={handleOpen} />
  }

  return (
    <div ref={dndRef} className={classes.root}>
      {element}
    </div>
  )
}

export default observer(ShipForm)
