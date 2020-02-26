import React, { useContext, createContext } from "react"
import { action, observable } from "mobx"
import { observer } from "mobx-react"

import Dialog from "@material-ui/core/Dialog"

import ShipSelectPanel, { ShipSelectPanelStateContext } from "../ShipSelectPanel"
import SeamapPanel, { SeamapPanelProps } from "../SeamapPanel"

class SeamapPanelState {
  @observable public open = false

  @observable public props?: SeamapPanelProps

  @action public onOpen = (props?: Pick<SeamapPanelProps, "onSelect">) => {
    this.open = true
    if (!props) {
      return
    }
    const onSelect: SeamapPanelProps["onSelect"] = data => {
      props.onSelect && props.onSelect(data)
      this.onClose()
    }

    this.props = { ...props, onSelect }
  }

  @action public onClose = () => {
    this.open = false
  }
}

export const SeamapPanelStateContext = createContext(new SeamapPanelState())

const Dialogs: React.FC = () => {
  const shipSelectPanelState = useContext(ShipSelectPanelStateContext)
  const mapPanelState = useContext(SeamapPanelStateContext)
  return (
    <>
      <Dialog fullWidth maxWidth="xl" open={shipSelectPanelState.open} onClose={shipSelectPanelState.onClose}>
        <ShipSelectPanel {...shipSelectPanelState.props} style={{ height: "80vh" }} />
      </Dialog>
      <Dialog fullWidth maxWidth="xl" open={mapPanelState.open} onClose={mapPanelState.onClose}>
        <SeamapPanel {...mapPanelState.props} />
      </Dialog>
    </>
  )
}

export default observer(Dialogs)
