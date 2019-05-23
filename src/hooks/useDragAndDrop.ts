import {
  __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd,
  DragObjectWithType,
  DropTargetMonitor,
  DragSourceMonitor
} from 'react-dnd'
const { useDrag, useDrop } = dnd

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

  const [dropCollectedProps, dndRef] = useDrop({ accept: item.type, ref: dragRef, drop })

  return [dragCollectedProps, dndRef] as const
}

export default useDragAndDrop
