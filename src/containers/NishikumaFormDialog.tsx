import React from 'react'

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

class NishikumaFormDialog extends React.Component<INishikumaFormDialogProps> {
  public state = {
    open: false,
    json: ''
  }

  public handleClickOpen = () => this.setState({ open: true })

  public handleClose = () => this.setState({ open: false })

  public handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ json: event.target.value })
    console.log(this.state.json)
  }

  public roadJson = () => {
    this.props.operationStore.fromNishikuma(this.state.json)
    this.setState({ open: false })
  }

  public render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} variant="outlined">
          <InputIcon />
          デッキビルダー形式を読み込む
        </Button>

        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogContent>
            <TextField
              label="デッキビルダー形式"
              style={{ margin: 8 }}
              placeholder="Placeholder"
              margin="normal"
              variant="outlined"
              onChange={this.handleTextChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.roadJson} color="secondary">
              Load
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default NishikumaFormDialog
