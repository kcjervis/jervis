import React from "react"
import clsx from "clsx"
import { Text, Flexbox } from "../../atoms"
import { ShipBanner } from "../../molecules"
import { RemoveButton, ShareButton, CopyButton } from "../../IconButtons"

import Paper from "@material-ui/core/Paper"
import ListItem, { ListItemProps } from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  root: {
    "&:hover $action": {
      display: "block"
    },
    "&:hover $ships": {
      marginRight: 100
    }
  },
  name: {
    width: 120,
    flex: "none",
    marginRight: 8
  },
  ships: {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  action: {
    display: "none"
  }
})

type OperationListItemProps = ListItemProps & {
  operationName: string
  shipIds: number[]
  onCopy?: () => void
  onShare?: () => void
  onRemove?: () => void
}

const primaryTypographyProps = { noWrap: true, display: "block" } as const

export default function OperationListItem(props: OperationListItemProps) {
  const { className, operationName, shipIds, onCopy, onShare, onRemove, ...listItemProps } = props
  const classes = useStyles()

  const images = shipIds.map((shipId, index) => <ShipBanner key={index} size="small" shipId={shipId} />)

  return (
    <div className={clsx(classes.root, className)}>
      <ListItem button {...(listItemProps as any)}>
        <ListItemText
          className={classes.name}
          primary={operationName}
          primaryTypographyProps={primaryTypographyProps}
        />
        <div className={classes.ships}>{images}</div>
        <ListItemSecondaryAction className={classes.action}>
          {onCopy && <CopyButton title="コピー" onClick={onCopy} />}
          {onShare && <ShareButton title="共有URLの生成、デッキビルダー、編成画像出力が使えます" onClick={onShare} />}
          {onRemove && <RemoveButton title="削除" onClick={onRemove} />}
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  )
}
