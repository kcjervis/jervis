import { useDrag, useDrop, DragObjectWithType, DragSourceMonitor, DragSourceHookSpec } from "react-dnd"
import { useRef, useEffect } from "react"

export type SortableProps = DragObjectWithType & {
  index: number
  move: (dragIndex: number, hoverIndex: number) => void
  onDragEnd?: () => void
}

export const useSortable = <T extends SortableProps>(props: T) => {
  const { type, index, move, onDragEnd } = props
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: type,
    hover: (item: SortableProps, monitor) => {
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const clientOffset = monitor.getClientOffset()
      if (!ref.current || !clientOffset) {
        return
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const clientOffsetY = clientOffset.y

      if (dragIndex < hoverIndex && clientOffsetY < hoverBoundingRect.top) {
        return
      }
      if (dragIndex > hoverIndex && clientOffsetY > hoverBoundingRect.bottom) {
        return
      }
      move(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag, preview] = useDrag({
    item: { ...props, key: Math.random() },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: onDragEnd
  })

  drag(drop(ref))

  return [{ isDragging }, ref, preview] as const
}
