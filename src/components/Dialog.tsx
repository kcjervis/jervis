import React, { useCallback, useState } from 'react'

import MuiDialog, { DialogProps as MuiDialogProps } from '@material-ui/core/Dialog'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { CloseButton } from './IconButtons'

const useStyles = makeStyles({
  close: { position: 'fixed', top: '10%', right: '10%' }
})

export type DialogProps = {
  button: React.ReactElement
} & Omit<MuiDialogProps, 'open' | 'onClose'>

const Dialog: React.FC<DialogProps> = ({ button, children, ...dialogProps }) => {
  const [open, setOpen] = useState(false)
  const handleClose = useCallback(() => setOpen(false), [])
  const handleClickOpen = useCallback(() => setOpen(true), [])

  const classes = useStyles()
  const buttonProps = {
    onClick: handleClickOpen
  }
  return (
    <>
      {React.cloneElement(button, buttonProps)}
      <MuiDialog open={open} onClose={handleClose} {...dialogProps}>
        {children}
        <CloseButton className={classes.close} onClick={handleClose} />
      </MuiDialog>
    </>
  )
}

export default Dialog
