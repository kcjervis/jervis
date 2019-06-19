import React, { useCallback, useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import green from '@material-ui/core/colors/green'
import Snackbar from '@material-ui/core/Snackbar'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { CopyButton } from '../components/IconButtons'
import { useOpen } from '../hooks'
import { ObservableOperation } from '../stores'
import { setOperation, urlShortener } from '../stores/firebase'

const useOperationShare = (operation: ObservableOperation) => {
  const [shareUrl, setShareUrl] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const createShareUrl = useCallback(async () => {
    const url = new URL(window.location.href)
    url.hash = ''
    const operationJson = JSON.stringify(operation)
    url.searchParams.set('operation-json', operationJson)
    if (isLoading) {
      return
    }
    setIsLoading(true)

    if (url.href.length > 6500 || operationJson.includes('#')) {
      const pathName = await setOperation(operation)
      url.searchParams.delete('operation-json')
      url.searchParams.set('operation-path', pathName)
    }

    const shortenerRes = await urlShortener(url.href, 'jervis')
    setIsLoading(false)
    if ('shortLink' in shortenerRes) {
      const { shortLink } = shortenerRes
      setShareUrl(shortLink)
      return shortLink
    }
    return url.href
  }, [isLoading, operation])

  return { shareUrl, createShareUrl }
}

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

type OperationShareDialogProps = { operation: ObservableOperation } & DialogProps

const OperationShareDialog: React.FC<OperationShareDialogProps> = ({ operation, ...dialogProps }) => {
  const { open: snackbarOpen, onOpen: handleSnackbarOpen, onClose: handleSnackbarClose } = useOpen()
  const { shareUrl, createShareUrl } = useOperationShare(operation)
  const classes = useStyles()

  const predeck = operation.toNishikumaJson

  return (
    <>
      <Dialog {...dialogProps}>
        <DialogTitle>
          <Typography>{operation.name}</Typography>
        </DialogTitle>
        <DialogContent>
          {shareUrl ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link href={shareUrl} target="_blank">
                {shareUrl}
              </Link>

              <CopyButton text={shareUrl} title="URLをコピー" />
            </div>
          ) : (
            <Button onClick={createShareUrl} color="primary">
              共有URLを生成する
            </Button>
          )}
        </DialogContent>
        <DialogContent>
          <TextField color="primary" label="デッキビルダー形式" value={predeck} />
          <CopyButton text={predeck} title="デッキビルダー形式をコピー" onCopy={handleSnackbarOpen} />
        </DialogContent>
        <DialogActions>
          <Button href={`https://www.nishikuma.net/ImgKCbuilder?predeck=${predeck}`} target="_blank" color="primary">
            編成画像出力で開く
          </Button>
          <Button href={`http://kancolle-calc.net/deckbuilder.html?predeck=${predeck}`} target="_blank" color="primary">
            デッキビルダーで開く
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  )
}

export default OperationShareDialog
