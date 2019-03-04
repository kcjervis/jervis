import React, { useRef, useState } from 'react'

import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { makeStyles } from '@material-ui/styles'

import DialogComponent from '../../components/DialogComponent'

const useStyles = makeStyles({
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

interface JsonDialogProps {
  json: string
}

const JsonDialog: React.FC<JsonDialogProps> = ({ json }) => {
  const classes = useStyles()
  const textRef = useRef<HTMLInputElement>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const handleSnackbarOpen = () => setSnackbarOpen(true)
  const handleSnackbarClose = () => setSnackbarOpen(false)

  const handleCopy = (event: React.MouseEvent<HTMLElement>) => {
    if (textRef.current) {
      textRef.current.select()
      document.execCommand('copy')
      event.currentTarget.focus()
      handleSnackbarOpen()
    }
  }

  return (
    <DialogComponent buttonLabel="デッキビルダー出力">
      <DialogContent>
        <TextField fullWidth={true} multiline={true} value={json} inputRef={textRef} />
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.nishikuma.net/ImgKCbuilder?predeck=${json}`}
          color="primary"
        >
          編成画像出力で開く
        </Button>

        <Button
          variant="outlined"
          target="_blank"
          rel="noopener noreferrer"
          href={`http://kancolle-calc.net/deckbuilder.html?predeck=${json}`}
          color="primary"
        >
          デッキビルダーで開く
        </Button>

        <Button variant="outlined" color="primary" onClick={handleCopy}>
          クリップボードにコピー
        </Button>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={snackbarOpen}
          onClose={handleSnackbarClose}
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

export default JsonDialog
