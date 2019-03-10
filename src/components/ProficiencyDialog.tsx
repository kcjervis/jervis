import { Proficiency } from 'kc-calculator/dist/objects/Equipment'
import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ProficiencyIcon from './ProficiencyIcon'

interface ProficiencyDialogProps {
  changeProficiency: (inter: number) => void
}

class ProficiencyDialog extends React.Component<ProficiencyDialogProps> {
  public state = {
    open: false
  }

  public handleClickOpen = () => {
    this.setState({ open: true })
  }

  public handleClose = () => {
    this.setState({ open: false })
  }

  public handleProficiencyChange = (inter: number) => () => {
    this.props.changeProficiency(inter)
    this.handleClose()
  }

  public render() {
    return (
      <div>
        <Button variant="outlined" size="small" onClick={this.handleClickOpen}>
          熟練度一括設定
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ style: { background: 'rgba(0, 0, 0, 0.7)' } }}
        >
          <DialogTitle id="alert-dialog-title">熟練度一括設定</DialogTitle>
          <DialogContent>
            {Proficiency.internalBounds.concat(120).map(inter => (
              <Button key={inter} onClick={this.handleProficiencyChange(inter)}>
                <ProficiencyIcon internal={inter} />
              </Button>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default ProficiencyDialog
