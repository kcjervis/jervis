import React from "react"

import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import IconButton from "@material-ui/core/IconButton"
import SettingsIcon from "@material-ui/icons/Settings"

class OperationSettingDialog extends React.Component {
  public state = {
    open: false
  }

  public handleClickOpen = () => this.setState({ open: true })

  public handleClose = () => this.setState({ open: false })

  public render() {
    return (
      <div>
        <IconButton onClick={this.handleClickOpen}>
          <SettingsIcon />
        </IconButton>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>aaa</DialogTitle>
        </Dialog>
      </div>
    )
  }
}

export default OperationSettingDialog
