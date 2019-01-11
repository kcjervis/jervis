import React from 'react'

import Button, { ButtonProps } from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

import { CloseButton } from './IconButtons'

const styles = createStyles({
  close: { position: 'fixed', top: '10%', right: '10%' }
})

interface IDialogComponent extends WithStyles<typeof styles> {
  buttonProps: ButtonProps & { children: React.ReactNode }
}

class DialogComponent extends React.Component<IDialogComponent> {
  public state = {
    open: false
  }

  public handleClickOpen = () => {
    this.setState({ open: true })
  }

  public handleClose = () => {
    this.setState({ open: false })
  }

  public render() {
    const { buttonProps, children, classes } = this.props
    return (
      <div>
        <Button {...buttonProps} onClick={this.handleClickOpen} />

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          PaperProps={{ style: { background: 'rgba(0, 0, 0, 0.8)' } }}
        >
          {children}
          <CloseButton className={classes.close} size="large" onClick={this.handleClose} />
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(DialogComponent)
