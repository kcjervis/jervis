import {
  useDrag,
  useDrop,
  DragObjectWithType,
  DropTargetMonitor,
  DragSourceMonitor,
  DragElementWrapper
} from 'react-dnd'

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

  const dndRef: DragElementWrapper<any> = element => dragRef(dropRef(element))

  return [dragCollectedProps, dndRef] as const
}

export default useDragAndDrop
