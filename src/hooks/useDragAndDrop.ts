import {
  __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd,
  DragObjectWithType,
  DropTargetMonitor
} from 'react-dnd'
const { useDrag, useDrop } = dnd

interface DragAndDropSourceHookSpec<DragObject extends DragObjectWithType, DropResult> {
  item: DragObject
  drop: (item: DragObject, monitor: DropTargetMonitor) => DropResult | undefined
}

const useDragAndDrop = <DragObject extends DragObjectWithType, DropResult>(
  spec: DragAndDropSourceHookSpec<DragObject, DropResult>
) => {
  const { item, drop } = spec
  const [dragCollectedProps, dragRef] = useDrag({ item, collect: monitor => ({ isDragging: monitor.isDragging() }) })

  const [dropCollectedProps, ref] = useDrop({ accept: item.type, ref: dragRef, drop })

  return [dragCollectedProps, ref] as const
}

export default useDragAndDrop
