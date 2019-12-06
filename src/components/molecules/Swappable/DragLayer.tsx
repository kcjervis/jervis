import React, { useMemo, useRef, useLayoutEffect } from "react"
import { useDragLayer, DragObjectWithType } from "react-dnd"
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
  const { itemType, dragObject, currentOffset } = useDragLayer(monitor => ({
    itemType: monitor.getItemType(),
    dragObject: monitor.getItem() as DragObject<T> | undefined,
    currentOffset: monitor.getSourceClientOffset()
  }))

  const element = useMemo(() => {
    if (!dragObject || itemType !== type) {
      return null
    }
    return renderItem(dragObject.item)
  }, [dragObject, itemType, type, renderItem])

  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node || !currentOffset) {
      return
    }
    node.style.transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`
  }, [ref, currentOffset])

  if (!element) {
    return null
  }

  return <Grabbing ref={ref}>{element}</Grabbing>
}
