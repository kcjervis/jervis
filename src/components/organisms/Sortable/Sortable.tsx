import React from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd/dist/react-beautiful-dnd.min"

type SortableItem = { id: string }

type SortableProps<T extends SortableItem> = {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactElement<HTMLElement>
  onSortEnd: (items: T[]) => void
}

export default function Sortable<T extends SortableItem>({ items, renderItem, onSortEnd }: SortableProps<T>) {
  const handleDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return
    }

    const nextItems = items.concat()
    const [dragItem] = nextItems.splice(source.index, 1)
    nextItems.splice(destination.index, 0, dragItem)
    onSortEnd(nextItems)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {provided => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    {renderItem(item, index)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
