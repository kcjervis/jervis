import React from 'react'
import { compose } from 'redux'
import { DropTarget, DragSource } from 'react-dnd'

const cardSource = {
  beginDrag(props, monitor, component) {
    return { component }
  },
  endDrag(props, monitor) {
    const dragItem = props
    const dropItem = monitor.getDropResult()
    if (dropItem && props.onEndDrag) {
      props.onEndDrag({ dragItem, dropItem })
    }
  }
}

const cardTarget = {
  drop(props, monitor) {
    return props
  }
}

const withDragAndDrop = type => WrappedComponent =>
  compose(
    DragSource(type, cardSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })),
    DropTarget(type, cardTarget, connect => ({
      connectDropTarget: connect.dropTarget()
    }))
  )(props => {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      ...restProps
    } = props
    const opacity = isDragging ? 0 : 1
    return connectDragSource(
      connectDropTarget(
        <div style={{ opacity }}>
          <WrappedComponent {...restProps} />
        </div>
      )
    )
  })

export default withDragAndDrop
