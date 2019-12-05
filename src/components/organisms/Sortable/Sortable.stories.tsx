import { action } from "@storybook/addon-actions"
import { DecoratorFn } from "@storybook/react"
import React from "react"
import { MuiThemeProvider } from "@material-ui/core"

import theme from "../../../theme"

import { DragDropContext, Draggable } from "react-beautiful-dnd"
import Sortable from "./Sortable"

import ListItem from "@material-ui/core/ListItem"
import Typography from "@material-ui/core/Typography"
const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`
  }))

const items = getItems(10)

const decorators: DecoratorFn[] = [story => <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>]

export default { title: "organisms|Sortable", decorators }

export const sortableItems = () => (
  <Sortable
    items={items}
    renderItem={item => (
      <ListItem>
        <Typography>{item.content}</Typography>
      </ListItem>
    )}
    onSortEnd={console.log}
  />
)
