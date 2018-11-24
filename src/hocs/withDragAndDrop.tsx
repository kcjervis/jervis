import React from 'react'
import { ConnectDragSource, ConnectDropTarget, DragSource, DragSourceSpec, DropTarget, DropTargetSpec } from 'react-dnd'

const withDragAndDrop = (type: string) => <WrappedProps extends {}>(
  WrappedComponent: React.ComponentType<WrappedProps>
) => {
  type THocProps = WrappedProps & {
    isDragging?: boolean
    connectDragSource?: ConnectDragSource
    connectDropTarget?: ConnectDropTarget
    index: number
    onEndDrag: (object: { dragProps: THocProps; dropProps: THocProps }) => void
  }

  const cardSource: DragSourceSpec<THocProps, {}> = {
    beginDrag: props => props,
    endDrag: (props, monitor) => {
      const dragProps = props
      const dropProps = monitor.getDropResult()
      if (dropProps && props.onEndDrag) {
        props.onEndDrag({ dragProps, dropProps })
      }
    }
  }

  const cardTarget: DropTargetSpec<THocProps> = {
    drop: props => props
  }

  const aaa = DragSource(type, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))

  @DragSource(type, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
  @DropTarget(type, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))
  class DragAndDrop extends React.Component<THocProps> {
    public static displayName? = `withDragAndDrop(${WrappedComponent.name})`

    public render() {
      const { isDragging, connectDragSource, connectDropTarget, ...restProps } = this.props as any
      const opacity = isDragging ? 0 : 1
      return connectDragSource(
        connectDropTarget(
          <div style={{ opacity }}>
            <WrappedComponent {...restProps} />
          </div>
        )
      )
    }
  }
  return DragAndDrop
}

export default withDragAndDrop
