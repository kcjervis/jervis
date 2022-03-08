import React, { useContext, useState } from "react"
import { observer } from "mobx-react"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import Checkbox from "@material-ui/core/Checkbox"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Link from "@material-ui/core/Link"
import IconButton from "@material-ui/core/IconButton"
import NotificationImportantIcon from "@material-ui/icons/NotificationImportant"

import { SettingStoreContext } from "../stores"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      background: "rgba(15, 20, 20, 0.95)",
      backdropFilter: "blur(4px)"
    },
    iconButton: {
      padding: 4,
      animation: "$bell-ring 2s infinite"
    },
    okButton: {
      color: "white"
    },
    "@keyframes bell-ring": {
      "5%, 15%": {
        transform: "rotate(25deg)"
      },
      "10%, 20%": {
        transform: "rotate(-25deg)"
      },
      "25%": {
        transform: "rotate(0deg)"
      },
      "100%": {
        transform: "rotate(0deg)"
      }
    }
  })
)

const NotificationButton: React.FC = () => {
  const classes = useStyles()

  const settingStore = useContext(SettingStoreContext)
  const { disableNotification } = settingStore

  const [open, setOpen] = useState(!disableNotification)

  return (
    <>
      <IconButton className={classes.iconButton} color="secondary" onClick={() => setOpen(true)}>
        <NotificationImportantIcon />
      </IconButton>

      <Dialog
        classes={{
          paper: classes.paper
        }}
        open={open}
      >
        <DialogTitle>サイト移転のお知らせ</DialogTitle>

        <DialogContent>
          <p>
            長らく更新が滞っており申し訳ありませんでした。
            <br />
            今後こちらでの更新は停止して、
            <Link href="https://jervis.vercel.app">移転先</Link>
            にて開発していきます。
          </p>

          <Link href="https://jervis.vercel.app" variant="h5" color="secondary" underline="always">
            jervis.vercel.app
          </Link>
        </DialogContent>

        <DialogActions>
          <FormControlLabel
            label="今後表示しない"
            control={
              <Checkbox
                checked={disableNotification}
                onClick={() => {
                  settingStore.disableNotification = !disableNotification
                }}
              />
            }
          />
          <Button className={classes.okButton} variant="contained" color="primary" onClick={() => setOpen(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default observer(NotificationButton)
