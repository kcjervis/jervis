import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

interface InjectedProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const withAlertDialog = <WrappedProps extends InjectedProps>(WrappedComponent: React.ComponentType<WrappedProps>) => {
  type THocProps = WrappedProps & {
    dialogTitle: string
  }
  interface HocState {
    readonly open: boolean
  }
  return class WithAlertDialog extends React.Component<THocProps, HocState> {
    public static displayName = `withAlertDialog(${WrappedComponent.name && WrappedComponent.displayName})`

    public static readonly WrappedComponent = WrappedComponent

    public readonly state = {
      open: false
    }

    public handleOpen = () => this.setState({ open: true })

    public handleClose = () => this.setState({ open: false })

    public handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
      this.props.onClick(event)
      this.setState({ open: false })
    }

    public render() {
      const { dialogTitle } = this.props
      return (
        <div>
          <WrappedComponent {...this.props} onClick={this.handleOpen} />
          <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogActions>
              <Button onClick={this.handleClose}>Cancel</Button>
              <Button onClick={this.handleClick} color="secondary">
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )
    }
  }
}

export default withAlertDialog
