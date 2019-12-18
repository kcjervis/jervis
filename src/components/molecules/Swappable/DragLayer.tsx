import React, { useMemo, useRef, useLayoutEffect } from "react"
import { useDragLayer, DragObjectWithType, XYCoord } from "react-dnd"
import { styled } from "@material-ui/core/styles"

export type DragObject<T> = DragObjectWithType & { index: number; item: T }

type DragLayerProps<T> = {
  type: string
  renderItem: (item: T) => React.ReactElement<HTMLElement>
}

const Grabbing = styled("div")({
  position: "fixed",
  pointerEvents: "none",
  top: 0,
  left: 0,
  zIndex: 100,
  width: "100%",
  height: "100%"
})

export default function DragLayer<T>({ type, renderItem }: DragLayerProps<T>) {
  const { itemType, dragObject, offset } = useDragLayer(monitor => ({
    itemType: monitor.getItemType(),
    dragObject: monitor.getItem() as DragObject<T> | undefined,
    offset: monitor.getSourceClientOffset()
  }))

  const typeIsEqual = itemType === type
  const element = useMemo(() => {
    if (!dragObject || !typeIsEqual) {
      return null
    }
    return renderItem(dragObject.item)
  }, [dragObject, typeIsEqual, renderItem])

  if (!element || !offset) {
    return null
  }
  const transform = `translate(${offset.x}px, ${offset.y}px)`

  return <Grabbing style={{ transform }}>{element}</Grabbing>
}
