import React, { useMemo } from "react"
import { observer } from "mobx-react-lite"
import { getEmptyImage } from "react-dnd-html5-backend"
import clsx from "clsx"
import { isNonNullable } from "kc-calculator"

import Divider from "@material-ui/core/Divider"
import { makeStyles } from "@material-ui/core/styles"

import { OperationListItem, Text } from "../components"
import OperationShareDialog from "./OperationShareDialog"

import { ObservableOperation } from "../stores"
import { useWorkspace, useOpen, useSortable } from "../hooks"

const useStyles = makeStyles({
  root: {}
})

export interface SortableOperationListItemProps {
  operation: ObservableOperation
  index: number
  onMove: (dragIndex: number, hoverIndex: number) => void
  onDragEnd: () => void
}

const SortableOperationListItem: React.FC<SortableOperationListItemProps> = ({
  operation,
  index,
  onMove,
  onDragEnd
}) => {
  const classes = useStyles()
  const { onOpen, ...dialogProps } = useOpen()
  const { openOperation } = useWorkspace()

  const [{ isDragging }, ref, preview] = useSortable({
    index,
    type: "OperationListItem",
    move: onMove,
    onDragEnd,
    operation
  })
  preview(getEmptyImage())

  const handleCopy = () => {
    operation.copy()
  }
  const handleOpen = () => openOperation(operation)

  const shipIds = useMemo(() => operation.fleets[0].ships.filter(isNonNullable).map(ship => ship.masterId), [operation])

  return (
    <>
      <OperationListItem
        innerRef={ref}
        className={classes.root}
        operationName={operation.name}
        shipIds={shipIds}
        onClick={handleOpen}
        onCopy={handleCopy}
        onShare={onOpen}
        onRemove={operation.remove}
      />
      <Divider />
      <OperationShareDialog operation={operation} {...dialogProps} />
    </>
  )
}

export default observer(SortableOperationListItem)
