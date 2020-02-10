import React from "react"
import { observer } from "mobx-react-lite"

import Dialog, { DialogProps } from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import Typography from "@material-ui/core/Typography"

import { FleetSharePanel } from "../components"
import { ObservableOperation } from "../stores"

type OperationShareDialogProps = { operation: ObservableOperation } & DialogProps

const OperationShareDialog: React.FC<OperationShareDialogProps> = ({ operation, ...dialogProps }) => {
  return (
    <Dialog {...dialogProps}>
      <DialogTitle>
        <Typography>{operation.name}</Typography>
      </DialogTitle>
      <DialogContent>
        <FleetSharePanel operation={operation} />
      </DialogContent>
    </Dialog>
  )
}

export default observer(OperationShareDialog)
