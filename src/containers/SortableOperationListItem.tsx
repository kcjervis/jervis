import React, { useEffect } from "react"
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
}

const SortableOperationListItem: React.FC<SortableOperationListItemProps> = ({ operation }) => {
  const classes = useStyles()
  const { onOpen, ...dialogProps } = useOpen()
  const { openOperation } = useWorkspace()

  const [{ isDragging }, ref, preview] = useSortable({
    index: operation.index,
    type: "OperationListItem",
    move: (dragIndex, hoverIndex) => {
      const { store } = operation
      if (!store) {
        return
      }

      const dragOperation = store.operations[dragIndex]
      const hoverOperation = operation
      dragOperation.swap(hoverOperation)
    },
    operation
  })
  preview(getEmptyImage())

  const handleCopy = () => {
    operation.copy()
  }
  const handleOpen = () => openOperation(operation)

  const shipIds = operation.fleets[0].ships.filter(isNonNullable).map(ship => ship.masterId)

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
