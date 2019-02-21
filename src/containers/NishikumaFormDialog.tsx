import React, { useCallback, useRef, useState } from 'react'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import InputIcon from '@material-ui/icons/Input'

import { OperationStore } from '../stores'

interface INishikumaFormDialogProps {
  operationStore: OperationStore
}

const NishikumaFormDialog: React.FC<INishikumaFormDialogProps> = ({ operationStore }) => {
  const [open, setOpen] = useState(false)
  const inputRef = useRef({ value: '' })
  const handleClickOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])
  const { history } = useReactRouter()
  const handleLoadClick = () => {
    const operation = operationStore.fromNishikuma(inputRef.current.value)
    if (operation) {
      operationStore.setActiveOperation(operation)
      history.push('operation')
    }
  }
  return (
    <>
      <Button onClick={handleClickOpen} variant="outlined">
        <InputIcon />
        デッキビルダー形式を読み込む
      </Button>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <TextField
            label="デッキビルダー形式"
            margin="dense"
            fullWidth={true}
            placeholder="Placeholder"
            variant="outlined"
            inputRef={inputRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLoadClick} color="secondary">
            Load
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NishikumaFormDialog
