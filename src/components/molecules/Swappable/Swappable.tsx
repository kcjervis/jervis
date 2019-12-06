import React, { useState, useCallback, useMemo, useRef, useLayoutEffect } from "react"
import { getEmptyImage } from "react-dnd-html5-backend"
import { useDragAndDrop } from "../../../hooks"
import DragLayer, { DragObject } from "./DragLayer"
import { styled } from "@material-ui/core/styles"

type DraggableItemProps<T> = {
  onDragEnd: (dragIndex: number, dropIndex: number) => void
  children: React.ReactNode
} & DragObject<T>

const Grab = styled("div")({ cursor: "grab" })

function DraggableItem<T>({ type, index, item, onDragEnd, children }: DraggableItemProps<T>) {
  const [, ref, preview] = useDragAndDrop({
    item: { type, index, item },
    drop: dragItem => onDragEnd(dragItem.index, index)
  })

  preview(getEmptyImage(), { captureDraggingState: true })

  return <Grab ref={ref}>{children}</Grab>
}

type SwappableProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactElement<HTMLElement>
  onUpdate: (items: T[]) => void
}

export default function Swappable<T>({ items, renderItem, onUpdate }: SwappableProps<T>) {
  const handleDragEnd = useCallback(
    (dragIndex: number, dropIndex: number) => {
      const nextItems = items.concat()
      nextItems[dragIndex] = items[dropIndex]
      nextItems[dropIndex] = items[dragIndex]
      onUpdate(nextItems)
    },
    [items, onUpdate]
  )

  const type = "swappable"

  return (
    <>
      {items.map((item, index) => (
        <DraggableItem key={index} type={type} index={index} item={item} onDragEnd={handleDragEnd}>
          {renderItem(item)}
        </DraggableItem>
      ))}
      <DragLayer type={type} renderItem={renderItem} />
    </>
  )
}
