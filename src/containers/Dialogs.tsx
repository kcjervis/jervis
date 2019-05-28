import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Dialog from '@material-ui/core/Dialog'

import ShipSelectPanel, { ShipSelectPanelStateContext } from './ShipSelectPanel'

const Dialogs: React.FC = () => {
  const shipSelectPanelState = useContext(ShipSelectPanelStateContext)
  return (
    <>
      <Dialog fullWidth maxWidth="xl" open={shipSelectPanelState.open} onClose={shipSelectPanelState.onClose}>
        <ShipSelectPanel {...shipSelectPanelState.props} />
      </Dialog>
    </>
  )
}

export default observer(Dialogs)
