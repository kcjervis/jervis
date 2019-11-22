import React from "react"
import { DragPreviewImage } from "react-dnd"
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
  dragging: { opacity: 0.5 }
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
      <div ref={ref} className={clsx({ [classes.dragging]: isDragging })}>
        <OperationListItem
          operationName={operation.name}
          shipIds={shipIds}
          onClick={handleOpen}
          onCopy={handleCopy}
          onShare={onOpen}
          onRemove={operation.remove}
        />
      </div>
      <Divider />
      <OperationShareDialog operation={operation} {...dialogProps} />
    </>
  )
}

export default SortableOperationListItem
