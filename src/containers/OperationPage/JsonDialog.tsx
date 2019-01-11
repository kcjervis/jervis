import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Snackbar from '@material-ui/core/Snackbar'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

import DialogComponent from '../../components/DialogComponent'

const styles = createStyles({
  snackbar: {
    backgroundColor: green[500]
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  },
  messageIcon: {
    fontSize: 20
  }
})

interface IJsonDialogProps extends WithStyles<typeof styles> {
  json: string
}

class JsonDialog extends React.Component<IJsonDialogProps> {
  public state = { openSnackbar: false }

  public handleSnackbarOpen = () => this.setState({ openSnackbar: true })

  public handleSnackbarClose = () => this.setState({ openSnackbar: false })

  public render() {
    const { json, classes } = this.props
    const isFirefox = window.navigator.userAgent.includes('Firefox')
    return (
      <DialogComponent buttonProps={{ children: 'デッキビルダー出力' }}>
        <DialogContent>
          <Typography>{json}</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            href={`https://www.nishikuma.net/ImgKCbuilder?predeck=${json}`}
            target="_blank"
            color="primary"
          >
            編成画像出力で開く
          </Button>

          <Button
            variant="outlined"
            href={`http://kancolle-calc.net/deckbuilder.html?predeck=${json}`}
            target="_blank"
            color="primary"
          >
            デッキビルダーで開く
          </Button>

          {!isFirefox && (
            <Button variant="outlined" color="primary">
              <CopyToClipboard text={json} onCopy={this.handleSnackbarOpen}>
                <Typography color="primary">クリップボードにコピー</Typography>
              </CopyToClipboard>
            </Button>
          )}

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            open={this.state.openSnackbar}
            onClose={this.handleSnackbarClose}
            autoHideDuration={2000}
            ContentProps={{
              'aria-describedby': 'message-id',
              className: classes.snackbar
            }}
            message={
              <Typography className={classes.message} id="message-id" variant="subtitle1">
                <CheckCircleIcon className={classes.messageIcon} />
                success
              </Typography>
            }
          />
        </DialogActions>
      </DialogComponent>
    )
  }
}

export default withStyles(styles)(JsonDialog)
