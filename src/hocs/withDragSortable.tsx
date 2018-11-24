import React from 'react'
import { ConnectDragSource, ConnectDropTarget, DragSource, DragSourceSpec, DropTarget, DropTargetSpec } from 'react-dnd'

const withDragSortable = (type: string) => <WrappedProps extends {}>(
  WrappedComponent: React.ComponentType<WrappedProps>
) => {
  interface IProps {
    index: number
    onSortEnd: (object: { dragProps: IProps; hoverProps: IProps }) => void
    isDragging?: boolean
    connectDragSource?: ConnectDragSource
    connectDropTarget?: ConnectDropTarget
  }

  const cardSource: DragSourceSpec<IProps, {}> = {
    beginDrag(props, monitor, component) {
      return { component }
    }
  }

  const cardTarget: DropTargetSpec<IProps> = {
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
  class DragSortable extends React.Component<IProps> {
    public static displayName? = `withDragAndDrop(${WrappedComponent.name})`

    public render() {
      const { isDragging, connectDragSource, connectDropTarget } = this.props as any
      const opacity = isDragging ? 0 : 1
      if (!connectDragSource || !connectDropTarget) {
        return null
      }
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
