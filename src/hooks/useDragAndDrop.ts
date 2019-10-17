import {
  useDrag,
  useDrop,
  DragObjectWithType,
  DropTargetMonitor,
  DragSourceMonitor,
  DragElementWrapper
} from "react-dnd"
import { useRef, useEffect } from "react"

interface DragAndDropSourceHookSpec<DragObject extends DragObjectWithType, DropResult> {
  item: DragObject
  canDrag?: (monitor: DragSourceMonitor) => boolean
  drop: (item: DragObject, monitor: DropTargetMonitor) => DropResult | undefined
}

const useDragAndDrop = <DragObject extends DragObjectWithType, DropResult>(
  spec: DragAndDropSourceHookSpec<DragObject, DropResult>
) => {
  const { item, canDrag, drop } = spec

  const [dragCollectedProps, dragRef] = useDrag({
    item,
    canDrag,
    collect: monitor => ({ isDragging: monitor.isDragging() })
  })

  const [dropCollectedProps, dropRef] = useDrop({ accept: item.type, drop })

  const { isDragging } = dragCollectedProps

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    dragRef(node)
    dropRef(node)
    const init = node.style.visibility
    if (isDragging) {
      node.style.visibility = "hidden"
    }
    return () => {
      node.style.visibility = init
    }
  }, [isDragging, ref.current, dragRef, dropRef])

  return [dragCollectedProps, ref] as const
}

export default useDragAndDrop
