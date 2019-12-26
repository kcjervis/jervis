import { action } from "@storybook/addon-actions"
import { DecoratorFn } from "@storybook/react"
import React from "react"
import HTML5Backend from "react-dnd-html5-backend"
import { DndProvider } from "react-dnd"

import Swappable from "./Swappable"

import ListItem from "@material-ui/core/ListItem"
import Typography from "@material-ui/core/Typography"

const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`
  }))

const decorators: DecoratorFn[] = [story => <DndProvider backend={HTML5Backend}>{story()}</DndProvider>]

export default { title: "molecules|Swappable", decorators }

export const swappableItems = () => {
  const [items, setItems] = React.useState(getItems(10))
  return (
    <Swappable
      items={items}
      renderItem={item => {
        return (
          <ListItem>
            <Typography>{item.content}</Typography>
          </ListItem>
        )
      }}
      onUpdate={setItems}
    />
  )
}
