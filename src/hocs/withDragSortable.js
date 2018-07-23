import React from 'react'
import { compose } from 'redux'
import { DropTarget, DragSource } from 'react-dnd'

const cardSource = {
  beginDrag(props, monitor, component) {
    return { component }
  }
}

const cardTarget = {
  hover(props, monitor) {
    const dragIndex = monitor.getItem().component.props.index
    const hoverIndex = props.index
    if (dragIndex === hoverIndex) return null
    props.onSortEnd({ dragIndex, hoverIndex })
  }
}

const dragSource = DragSource('sortable', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

const dropTarget = DropTarget('sortable', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))

const withDragSortable = WrappedComponent =>
  compose(
    dragSource,
    dropTarget
  )(props => {
    const {
      isDragging,
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
      ...restProps
    } = props
    const opacity = isDragging ? 0 : 1
    return connectDragSource(
      connectDropTarget(
        <div style={{ opacity, display: 'inline-block' }}>
          <WrappedComponent {...restProps} />
        </div>
      )
    )
  })

export default withDragSortable
