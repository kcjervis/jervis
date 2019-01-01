import React from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Fade from '@material-ui/core/Fade'
import Popper from '@material-ui/core/Popper'
import TextField from '@material-ui/core/TextField'

interface IProficiencyButtonProps {
  internal: number
  onChangeProficiency: (internal: number) => void
}

interface IProficiencyButtonState {
  anchorEl: HTMLElement | null
}

export default class ProficiencyButton extends React.Component<IProficiencyButtonProps, IProficiencyButtonState> {
  public state = { anchorEl: null }

  public handleOpen: React.MouseEventHandler<HTMLElement> = event => this.setState({ anchorEl: event.currentTarget })

  public handleClose = () => this.setState({ anchorEl: null })

  public render() {
    const { anchorEl } = this.state
    return (
      <div>
        {/*熟練度ポップアップ*/}
        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} transition={true}>
          {({ TransitionProps }) => (
            <ClickAwayListener onClickAway={this.handleClose}>
              <Fade {...TransitionProps} timeout={150}>
                <TextField
                  label="熟練度"
                  variant="outlined"
                  inputProps={{ type: 'number' }}
                  value={this.props.internal}
                />
              </Fade>
            </ClickAwayListener>
          )}
        </Popper>
      </div>
    )
  }
}
