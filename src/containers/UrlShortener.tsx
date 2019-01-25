import React, { useCallback, useRef, useState } from 'react'

import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { urlShortener } from '../stores/firebase'

const isUrl = (value: string) => value.includes('http')

const UrlShortener = () => {
  const [status, setStatus] = useState('URLを入力してください')
  const [shortLink, setShortLink] = useState('')
  const inputRef = useRef({ value: '' })
  const handleClick = useCallback(async () => {
    const url = inputRef.current.value
    if (!isUrl(url)) {
      setStatus('正しいURLを入力してください')
      return
    }

    setStatus('生成中')

    const res = await urlShortener(inputRef.current.value, 'kancolle')
    if ('shortLink' in res) {
      setStatus('')
      setShortLink(res.shortLink)
    } else {
      setStatus('短縮に失敗しました')
    }
  }, [])
  return (
    <Paper style={{ margin: 16 }}>
      <TextField label="URL" inputRef={inputRef} fullWidth={true} />

      <CardContent>
        <Typography color="primary">{status}</Typography>
        <Button variant="outlined" onClick={handleClick}>
          Shorten
        </Button>
      </CardContent>

      <CardContent>{isUrl(shortLink) && <Typography variant="h4">{shortLink}</Typography>}</CardContent>
    </Paper>
  )
}

export default UrlShortener
