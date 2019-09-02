import React, { useState, useCallback, useMemo } from "react"
import clsx from "clsx"
import useReactRouter from "use-react-router"
import { observer } from "mobx-react-lite"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"

import ShipIcon from "@material-ui/icons/AssignmentInd"

import { CloseButton } from "../../components/IconButtons"
import { ItemLabel, OperationIcon } from "../../components"

import { WorkspaceItem } from "../../stores"
import { useWorkspace, useOperationStore } from "../../hooks"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "inline-flex",
      alignItems: "center",
      minWidth: 8 * 15,
      maxWidth: 8 * 25,
      height: "100%",
      borderRight: `thin solid ${theme.palette.grey[800]}`
    },
    divider: {
      width: 1,
      height: "60%",
      background: theme.palette.grey[500]
    },
    name: {
      color: theme.palette.text.disabled,
      cursor: "pointer",
      maxWidth: "calc(100% - 32px)",
      height: "100%",
      flexGrow: 1
    },
    active: {
      color: theme.palette.text.primary
    }
  })
)

const useWorkspaceTab = (item: WorkspaceItem) => {
  const { history } = useReactRouter()
  const { workspaceStore, itemSelector } = useWorkspace()

  const setActive = useCallback(() => {
    item.setActive()
    history.replace("operation")
  }, [item])

  const name = useMemo(() => {
    const itemState = itemSelector(item)
    return itemState ? itemState.name : ""
  }, [item])

  return { setActive, name }
}

interface WorkspaceTabProps {
  item: WorkspaceItem
}

const WorkspaceTab: React.FC<WorkspaceTabProps> = ({ item }) => {
  const [visibleClose, setVisibleClose] = useState(false)
  const classes = useStyles()
  const { getOperation, isTemporary } = useOperationStore()

  const { setActive, name } = useWorkspaceTab(item)

  const handleMouseOver = useCallback(() => setVisibleClose(true), [])
  const handleMouseOut = useCallback(() => setVisibleClose(false), [])
  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      item.remove()
    },
    [item]
  )

  let icon: JSX.Element
  if (item.type === "Operation") {
    const operation = getOperation(item.id)
    if (!operation) {
      return null
    }
    icon = <OperationIcon color={isTemporary(operation) ? "default" : "secondary"} />
  } else {
    icon = <ShipIcon fontSize="inherit" />
  }

  return (
    <>
      <div className={classes.root} onClick={setActive} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
        <ItemLabel icon={icon} text={name} className={clsx(classes.name, { [classes.active]: item.isActive })} />
        <div style={{ width: 24, margin: "0 4px" }}>
          {visibleClose && <CloseButton size="small" onClick={handleClose} />}
        </div>
      </div>
    </>
  )
}

export default observer(WorkspaceTab)
