import { observer } from "mobx-react-lite"
import React, { useState, useEffect } from "react"

import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import Add from "@material-ui/icons/Add"

import SortableOperationListItem from "./SortableOperationListItem"
import { Flexbox } from "../components"
import { ObservableOperation } from "../stores"
import { useOperationStore, useOpen } from "../hooks"
import OperationCreateDialog from "./Explorer/OperationCreateDialog"
import { swap } from "../utils"

const OperationsPage: React.FC = props => {
  const { persistentOperationStore } = useOperationStore()

  const { onOpen: onDialogOpen, ...dialogProps } = useOpen()

  const [list, setList] = useState(persistentOperationStore.operations.concat())

  const handleMove = (dragIndex: number, hoverIndex: number) => {
    setList(prevList => {
      const nextList = prevList.concat()
      swap(nextList, dragIndex, nextList, hoverIndex)
      return nextList
    })
  }

  const handleDragEnd = () => {
    persistentOperationStore.setOperations(list)
  }

  useEffect(() => {
    setList(persistentOperationStore.operations)
  }, [persistentOperationStore.operations])

  return (
    <Flexbox justifyContent="center">
      <Box width="100%" maxWidth={1000} mt={1}>
        <Button onClick={onDialogOpen} variant="outlined" size="large">
          <Add />
          編成を作成
        </Button>

        <OperationCreateDialog store={persistentOperationStore} {...dialogProps} />

        <List>
          {list.map((operation, index) => (
            <SortableOperationListItem
              key={operation.id}
              operation={operation}
              index={index}
              onMove={handleMove}
              onDragEnd={handleDragEnd}
            />
          ))}
        </List>
      </Box>
    </Flexbox>
  )
}

export default observer(OperationsPage)
