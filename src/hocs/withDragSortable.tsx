import React from 'react'
import { ConnectDragSource, ConnectDropTarget, DragSource, DragSourceSpec, DropTarget, DropTargetSpec } from 'react-dnd'

const withDragSortable = (type: string) => <WrappedProps extends {}>(
  WrappedComponent: React.ComponentType<WrappedProps>
) => {
  type THocProps = WrappedProps & {
    isDragging: boolean
    connectDragSource: ConnectDragSource
    connectDropTarget: ConnectDropTarget
    index: number
    onSortEnd: (object: { dragProps: THocProps; hoverProps: THocProps }) => void
  }

  const cardSource: DragSourceSpec<THocProps, {}> = {
    beginDrag(props, monitor, component) {
      return { component }
    }
  }

  const cardTarget: DropTargetSpec<THocProps> = {
    hover(props, monitor) {
      const dragProps = monitor.getItem().component.props
      const hoverProps = props
      props.onSortEnd({ dragProps, hoverProps })
    }
  }

  @DragSource(type, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
  @DropTarget(type, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))
  class DragSortable extends React.Component<THocProps> {
    public static displayName = `withDragSortable(${WrappedComponent.name})`

    public static readonly WrappedComponent = WrappedComponent

    public render() {
      const { isDragging, connectDragSource, connectDropTarget } = this.props
      const opacity = isDragging ? 0 : 1
      return connectDragSource(
        connectDropTarget(
          <div style={{ opacity, display: 'inline-block' }}>
            <WrappedComponent {...this.props} />
          </div>
        )
      )
    }
  }
  return DragSortable
}

export default withDragSortable
