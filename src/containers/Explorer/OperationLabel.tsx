import React from 'react'
import { observer } from 'mobx-react-lite'

import { Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Popover from '@material-ui/core/Popover'
import { makeStyles, createStyles } from '@material-ui/styles'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ShareIcon from '@material-ui/icons/Share'

import { MoreVertButton } from '../../components/IconButtons'
import OperationShareDialog from '../OperationShareDialog'
import { ItemLabel, OperationIcon } from '../../components'

import { ObservableOperation } from '../../stores'
import { useAnchorEl, useOpen, useDragAndDrop, useWorkspace } from '../../hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      cursor: 'pointer',
      '&:hover': {
        background: theme.palette.grey[800]
      }
    },
    item: {
      padding: 0,
      justifyContent: 'start',
      borderRadius: 0,
      flexGrow: 1
    }
  })
)

type OperationLabelProps = {
  operation: ObservableOperation
  temporary?: boolean
}

const OperationLabel: React.FC<OperationLabelProps> = ({ operation, temporary }) => {
  const { anchorEl, onClick: onMenuClick, onClose } = useAnchorEl()
  const classes = useStyles()
  const { onOpen: onShareOpen, ...shareProps } = useOpen()
  const { openOperation } = useWorkspace()

  const handleClick = () => openOperation(operation)

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    onMenuClick(event)
    return false
  }

  const handleCopyClick = () => {
    operation.copy()
    onClose()
  }

  const item = { type: 'OperationLabel', operation }
  const [collectedProps, dndRef] = useDragAndDrop({
    item,
    drop: dragItem => dragItem.operation.switch(operation)
  })

  return (
    <>
      <div
        ref={dndRef}
        className={classes.root}
        style={{ opacity: collectedProps.isDragging ? 0 : 1 }}
        onContextMenu={handleContextMenu}
      >
        <div className={classes.item} onClick={handleClick}>
          <ItemLabel icon={<OperationIcon temporary={temporary} />} text={operation.name} />
        </div>
        <MoreVertButton size="small" onClick={onMenuClick} />
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transitionDuration={{ enter: 300, exit: 0 }}
      >
        <ClickAwayListener onClickAway={onClose} mouseEvent="onMouseDown">
          <MenuList>
            <MenuItem onClick={operation.remove}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText inset primary="編成を削除" />
            </MenuItem>

            <MenuItem onClick={handleCopyClick}>
              <ListItemIcon>
                <FileCopyIcon />
              </ListItemIcon>
              <ListItemText inset primary="編成をコピー" />
            </MenuItem>

            <MenuItem onClick={onShareOpen}>
              <ListItemIcon>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText inset primary="編成を共有" />
            </MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Popover>

      <OperationShareDialog operation={operation} {...shareProps} onExit={onClose} />
    </>
  )
}

export default observer(OperationLabel)
