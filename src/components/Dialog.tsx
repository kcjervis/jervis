import React, { useCallback, useState } from 'react'

import Button, { ButtonProps } from '@material-ui/core/Button'
import MuiDialog, { DialogProps as MuiDialogProps } from '@material-ui/core/Dialog'

import { makeStyles } from '@material-ui/styles'

import { CloseButton } from './IconButtons'
import { Omit } from '@material-ui/core'

const useStyles = makeStyles({
  close: { position: 'fixed', top: '10%', right: '10%' }
})

type DialogProps = {
  button: React.ReactElement
  buttonProps?: ButtonProps
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