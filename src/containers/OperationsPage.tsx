import { observer } from "mobx-react-lite"
import React from "react"

import Button from "@material-ui/core/Button"
import Add from "@material-ui/icons/Add"

import OperationCard from "./OperationCard"

import { ObservableOperation } from "../stores"
import { useOperationStore, useOpen } from "../hooks"
import OperationCreateDialog from "./Explorer/OperationCreateDialog"

const OperationsPage: React.FC = props => {
  const { persistentOperationStore } = useOperationStore()

  const { onOpen: onDialogOpen, ...dialogProps } = useOpen()

  return (
    <div style={{ margin: 8 }}>
      <Button onClick={onDialogOpen} fullWidth size="large">
        <Add />
        編成を追加
      </Button>

      <OperationCreateDialog store={persistentOperationStore} {...dialogProps} />

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {persistentOperationStore.operations.map((operation, index) => (
          <OperationCard key={index} operation={operation} />
        ))}
      </div>
    </div>
  )
}

export default observer(OperationsPage)
