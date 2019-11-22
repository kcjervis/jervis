import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"

import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import Add from "@material-ui/icons/Add"

import SortableOperationListItem from "./SortableOperationListItem"

import { ObservableOperation } from "../stores"
import { useOperationStore, useOpen } from "../hooks"
import OperationCreateDialog from "./Explorer/OperationCreateDialog"

const OperationsPage: React.FC = props => {
  const { persistentOperationStore } = useOperationStore()

  const { onOpen: onDialogOpen, ...dialogProps } = useOpen()

  return (
    <div style={{ margin: 8, maxWidth: 1000 }}>
      <Button onClick={onDialogOpen} variant="outlined" size="large">
        <Add />
        編成を作成
      </Button>

      <OperationCreateDialog store={persistentOperationStore} {...dialogProps} />

      <Paper>
        <List>
          {persistentOperationStore.operations.map((operation, index) => (
            <SortableOperationListItem key={index} operation={operation} />
          ))}
        </List>
      </Paper>
    </div>
  )
}

export default observer(OperationsPage)
