import { observer } from "mobx-react-lite"
import React from "react"

import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import Add from "@material-ui/icons/Add"

import SortableOperationListItem from "./SortableOperationListItem"
import { Flexbox, Sortable } from "../components"
import { useOperationStore, useOpen } from "../hooks"
import OperationCreateDialog from "./Explorer/OperationCreateDialog"
import { ObservableOperation } from "../stores"

const renderItem = (operation: ObservableOperation) => <SortableOperationListItem operation={operation} />

const OperationsPage: React.FC = props => {
  const { persistentOperationStore } = useOperationStore()

  const { onOpen: onDialogOpen, ...dialogProps } = useOpen()

  const { operations } = persistentOperationStore
  operations.forEach(o => o)

  return (
    <Flexbox justifyContent="center">
      <Box width="100%" maxWidth={1000} mt={1}>
        <Button onClick={onDialogOpen} variant="outlined" size="large">
          <Add />
          編成を作成
        </Button>

        <OperationCreateDialog store={persistentOperationStore} {...dialogProps} />

        <List>
          <Sortable items={operations} renderItem={renderItem} onSortEnd={persistentOperationStore.setOperations} />
        </List>
      </Box>
    </Flexbox>
  )
}

export default observer(OperationsPage)
