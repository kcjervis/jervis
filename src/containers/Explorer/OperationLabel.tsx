import React, { useRef } from "react"
import clsx from "clsx"
import { observer } from "mobx-react-lite"

import Button from "@material-ui/core/Button"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Popover from "@material-ui/core/Popover"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import MenuList from "@material-ui/core/MenuList"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"

import DeleteIcon from "@material-ui/icons/Delete"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import ShareIcon from "@material-ui/icons/Share"

import OperationShareDialog from "../OperationShareDialog"
import { ItemLabel, OperationIcon, MoreVertButton, SaveButton } from "../../components"

import { ObservableOperation } from "../../stores"
import { useAnchorEl, useOpen, useWorkspace, useSortable, useHover } from "../../hooks"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      cursor: "pointer",
      "&:hover": {
        background: theme.palette.grey[800]
      },
      "&:hover $button": {
        display: "block"
      }
    },
    item: {
      padding: 0,
      justifyContent: "start",
      borderRadius: 0,
      flexGrow: 1,
      maxWidth: "calc(100% - 24px)"
    },
    button: {
      display: "none"
    }
  })
)

type OperationLabelProps = {
  operation: ObservableOperation
  temporary?: boolean
  onSave?: (operation: ObservableOperation) => void
}

const OperationLabel: React.FC<OperationLabelProps> = props => {
  const { operation, temporary } = props
  const { anchorEl, onClick: onMenuClick, onClose } = useAnchorEl()
  const classes = useStyles()
  const { onOpen: onShareOpen, ...shareProps } = useOpen()
  const { openOperation } = useWorkspace()

  const handleClick = () => openOperation(operation)

  const handleContextMenu = (event: Parameters<typeof onMenuClick>[0]) => {
    event.preventDefault()
    onMenuClick(event)
    return false
  }

  const handleCopyClick = () => {
    operation.copy()
    onClose()
  }

  const handleSaveClick = () => props.onSave?.(operation)

  return (
    <>
      <div className={clsx(classes.root)} onContextMenu={handleContextMenu}>
        <div className={classes.item} onClick={handleClick}>
          <ItemLabel icon={<OperationIcon temporary={temporary} />} text={operation.name} />
        </div>
        {temporary && <SaveButton className={classes.button} size="small" onClick={handleSaveClick} />}
        <MoreVertButton className={classes.button} size="small" onClick={onMenuClick} />
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center"
        }}
        transitionDuration={{ enter: 300, exit: 0 }}
      >
        <ClickAwayListener onClickAway={onClose} mouseEvent="onMouseDown">
          <MenuList>
            <MenuItem onClick={operation.remove}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="編成を削除" />
            </MenuItem>

            <MenuItem onClick={handleCopyClick}>
              <ListItemIcon>
                <FileCopyIcon />
              </ListItemIcon>
              <ListItemText primary="編成をコピー" />
            </MenuItem>

            <MenuItem onClick={onShareOpen}>
              <ListItemIcon>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText primary="編成を共有" />
            </MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Popover>

      <OperationShareDialog operation={operation} {...shareProps} onExit={onClose} />
    </>
  )
}

export default observer(OperationLabel)
