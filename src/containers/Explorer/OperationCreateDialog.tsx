import React, { useRef, useCallback } from "react"
import clsx from "clsx"

import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Dialog, { DialogProps } from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"

import { OperationStore, ObservableOperation } from "../../stores"
import { useWorkspace } from "../../hooks"

type OperationCreateDialogProps = { store: OperationStore; onClose: () => void } & DialogProps

const OperationCreateDialog: React.FC<OperationCreateDialogProps> = ({ store, ...dialogProps }) => {
  const nameRef = useRef<HTMLInputElement>()
  const jsonRef = useRef<HTMLInputElement>()
  const { openOperation } = useWorkspace()

  const defaultName = `編成${store.operations.length}`

  const handleCreateClick = () => {
    if (!nameRef.current || !jsonRef.current) {
      return
    }
    const currentName = nameRef.current.value
    const name = currentName === "" ? defaultName : currentName
    let newOperation: ObservableOperation
    try {
      newOperation = store.fromNishikuma(jsonRef.current.value, name)
    } catch {
      newOperation = store.createOperation(name)
    }
    dialogProps.onClose()
    openOperation(newOperation)
  }

  const handleEnterClick = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.keyCode === 13) {
        event.preventDefault()
        handleCreateClick()
      }
    },
    [handleCreateClick]
  )

  return (
    <Dialog {...dialogProps} onKeyDown={handleEnterClick}>
      <DialogContent>
        <TextField label="編成名" fullWidth inputRef={nameRef} />
        <Typography color="primary" variant="overline">
          未入力は「<Typography variant="overline">{defaultName}</Typography>」になります。
        </Typography>
      </DialogContent>

      <DialogContent>
        <TextField label="デッキビルダー形式" fullWidth inputRef={jsonRef} />
        <Typography color="primary" variant="overline">
          デッキビルダー形式から編成を作成することもできます。
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCreateClick}>編成を作成</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OperationCreateDialog
