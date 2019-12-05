import React, { useCallback } from "react"
import { observer } from "mobx-react-lite"

import FolderIcon from "@material-ui/icons/Folder"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"

import OperationLabel from "./OperationLabel"
import OperationCreateDialog from "./OperationCreateDialog"
import { ItemLabel, AddButton, Sortable } from "../../components"

import { OperationStore, WorkspaceStore, ObservableOperation } from "../../stores"
import { useOpen, useOperationStore } from "../../hooks"

const useStyles = makeStyles(
  createStyles({
    root: {
      display: "flex"
    },
    folder: {
      flexGrow: 1
    },
    inner: {
      marginLeft: 8
    }
  })
)

type OperationsFolderProps = {
  workspace: WorkspaceStore
  store: OperationStore
}

const OperationsFolder: React.FC<OperationsFolderProps> = ({ store }) => {
  const { onOpen, ...dialogProps } = useOpen()
  const classes = useStyles()
  const { temporaryOperationStore, persistentOperationStore } = useOperationStore()
  const temporary = temporaryOperationStore === store

  const handleSave = (operation: ObservableOperation) => {
    persistentOperationStore.push(operation)
  }
  store.operations.forEach(o => o)

  return (
    <>
      <div className={classes.root}>
        <ItemLabel
          className={classes.folder}
          icon={<FolderIcon fontSize="inherit" color={temporary ? undefined : "secondary"} />}
          text={temporary ? "保存しない編成" : "編成"}
        />
        {!temporary && (
          <AddButton title="編成を作成" size="small" tooltipProps={{ placement: "right" }} onClick={onOpen} />
        )}
      </div>
      <div className={classes.inner}>
        <Sortable
          items={store.operations}
          renderItem={operation => <OperationLabel operation={operation} temporary={temporary} onSave={handleSave} />}
          onSortEnd={store.setOperations}
        />
      </div>

      <OperationCreateDialog store={store} {...dialogProps} />
    </>
  )
}

export default observer(OperationsFolder)
