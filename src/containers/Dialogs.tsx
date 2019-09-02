import React, { useContext } from "react"
import { observer } from "mobx-react-lite"

import Dialog from "@material-ui/core/Dialog"

import ShipSelectPanel, { ShipSelectPanelStateContext } from "./ShipSelectPanel"
import MapsPanel, { MapsPanelStateContext } from "./MapsPanel"

const Dialogs: React.FC = () => {
  const shipSelectPanelState = useContext(ShipSelectPanelStateContext)
  const mapsPanelState = useContext(MapsPanelStateContext)
  return (
    <>
      <Dialog fullWidth maxWidth="xl" open={shipSelectPanelState.open} onClose={shipSelectPanelState.onClose}>
        <ShipSelectPanel {...shipSelectPanelState.props} style={{ height: "80vh" }} />
      </Dialog>
      <Dialog fullWidth maxWidth="xl" open={mapsPanelState.open} onClose={mapsPanelState.onClose}>
        <MapsPanel {...mapsPanelState.props} />
      </Dialog>
    </>
  )
}

export default observer(Dialogs)
