import React from "react"
import clsx from "clsx"
import { Text, Flexbox } from "../../atoms"
import ShipImage from "../../ShipImage"
import { RemoveButton, ShareButton, CopyButton } from "../../IconButtons"

import Paper from "@material-ui/core/Paper"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  root: {
    "&:hover $action": {
      display: "block"
    }
  },
  name: {
    width: 120,
    flex: "none",
    marginRight: 8
  },
  ships: {
    paddingRight: 156,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  action: {
    display: "none"
  }
})

type OperationListItemProps = {
  operationName: string
  shipIds: number[]
  onClick?: () => void
  onCopy?: () => void
  onShare?: () => void
  onRemove?: () => void
}

const primaryTypographyProps = { noWrap: true, display: "block" } as const

export default function OperationListItem(props: OperationListItemProps) {
  const { operationName, shipIds, onClick, onCopy, onShare, onRemove } = props
  const classes = useStyles()

  const images = shipIds.map((shipId, index) => (
    <ShipImage key={index} masterId={shipId} height={24} imageType="banner" />
  ))

  return (
    <div className={classes.root}>
      <ListItem onClick={onClick} button>
        <ListItemText
          className={classes.name}
          primary={operationName}
          primaryTypographyProps={primaryTypographyProps}
        />
        <div className={classes.ships}>{images}</div>
        <ListItemSecondaryAction className={classes.action}>
          <CopyButton title="コピー" onClick={onCopy} />
          <ShareButton title="共有URLの生成、デッキビルダー、編成画像出力が使えます" onClick={onShare} />
          <RemoveButton title="削除" onClick={onRemove} />
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  )
}
