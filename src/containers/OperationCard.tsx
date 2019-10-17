import React from "react"

import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Typography from "@material-ui/core/Typography"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"

import { CopyButton, RemoveButton, ShareButton } from "../components/IconButtons"
import ShipImage from "../components/ShipImage"
import OperationShareDialog from "./OperationShareDialog"

import { ObservableOperation } from "../stores"
import { useWorkspace, useDragAndDrop, useOpen } from "../hooks"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 8,
      width: 8 * 40,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    actions: {}
  })
)

export interface OperationCardProps {
  operation: ObservableOperation
}

const OperationCard: React.FC<OperationCardProps> = ({ operation }) => {
  const classes = useStyles()
  const { onOpen, ...dialogProps } = useOpen()
  const { openOperation } = useWorkspace()
  const [dndProps, dndRef] = useDragAndDrop({
    item: { type: "OperationCard", operation },
    drop: item => item.operation.swap(operation)
  })

  const handleCopy = () => {
    operation.copy()
  }
  const handleOpen = () => openOperation(operation)
  return (
    <Card className={classes.root} innerRef={dndRef}>
      <div>
        {operation.fleets[0].ships.map(
          ship => ship && <ShipImage key={ship.id} imageType="banner" masterId={ship.masterId} />
        )}
      </div>
      <CardContent>
        <Typography>{operation.name}</Typography>
      </CardContent>

      <CardActions className={classes.actions}>
        <Button onClick={handleOpen} size="large">
          編成を開く
        </Button>
        <RemoveButton title="編成を削除" onClick={operation.remove} />
        <CopyButton title="編成をコピー" onClick={handleCopy} />
        <ShareButton title="共有URLの生成、デッキビルダー、編成画像出力が使えます" onClick={onOpen} />

        <OperationShareDialog operation={operation} {...dialogProps} />
      </CardActions>
    </Card>
  )
}

export default OperationCard
