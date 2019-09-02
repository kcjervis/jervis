import React, { useCallback, useRef, useState } from "react"

import Button from "@material-ui/core/Button"
import CardContent from "@material-ui/core/CardContent"
import Link from "@material-ui/core/Link"
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"

import { CopyButton } from "../components/IconButtons"
import { urlShortener } from "../stores/firebase"

const isUrl = (value: string) => value.includes("http")

const UrlShortener = () => {
  const [status, setStatus] = useState("URLを入力してください")
  const [shortLink, setShortLink] = useState("")
  const inputRef = useRef({ value: "" })
  const handleClick = useCallback(async () => {
    const url = inputRef.current.value
    if (!isUrl(url)) {
      setStatus("正しいURLを入力してください")
      return
    }

    setStatus("生成中")

    const res = await urlShortener(inputRef.current.value, "kancolle")
    console.log(res)
    if ("shortLink" in res) {
      setStatus("")
      setShortLink(res.shortLink)
    } else {
      setStatus("短縮に失敗しました")
    }
  }, [])
  return (
    <Paper style={{ margin: 16 }}>
      <CardContent>
        <TextField label="URL" inputRef={inputRef} fullWidth={true} />
        <Typography color="primary">{status}</Typography>
        <Button variant="outlined" onClick={handleClick}>
          Shorten
        </Button>
      </CardContent>

      <CardContent>
        {isUrl(shortLink) && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link variant="h4" href={shortLink} target="_blank">
              {shortLink}
            </Link>

            <CopyButton title="URLをコピー" text={shortLink} />
          </div>
        )}
      </CardContent>
    </Paper>
  )
}

export default UrlShortener
