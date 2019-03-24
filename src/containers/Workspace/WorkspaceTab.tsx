import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import useReactRouter from 'use-react-router'

import { makeStyles, createStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import { CloseButton } from '../../components/IconButtons'
import { ItemLabel, OperationIcon } from '../../components'

import { WorkspaceItem } from '../../stores'
import { useWorkspace, useOperationStore } from '../../hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      minWidth: 8 * 15,
      maxWidth: 8 * 25,
      height: '100%',
      borderRight: `thin solid ${theme.palette.grey[800]}`
    },
    divider: {
      width: 1,
      height: '60%',
      background: theme.palette.grey[500]
    },
    name: {
      color: theme.palette.text.disabled,
      cursor: 'pointer',
      maxWidth: 'calc(100% - 32px)',
      height: '100%',
      flexGrow: 1
    },
    active: {
      color: theme.palette.text.primary
    }
  })
)

interface WorkspaceTabProps {
  item: WorkspaceItem
}

const WorkspaceTab: React.FC<WorkspaceTabProps> = ({ item }) => {
  const [visibleClose, setVisibleClose] = useState(false)
  const classes = useStyles()
  const { getOperation, isTemporary } = useOperationStore()
  const { history } = useReactRouter()

  const handleClick = useCallback(() => {
    item.setActive()
    history.replace('operation')
  }, [item])

  const handleMouseOver = useCallback(() => setVisibleClose(true), [])
  const handleMouseOut = useCallback(() => setVisibleClose(false), [])
  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      item.remove()
    },
    [item]
  )

  const operation = getOperation(item.id)
  if (!operation) {
    return null
  }
  const icon = <OperationIcon color={isTemporary(operation) ? 'default' : 'secondary'} />

  return (
    <>
      <div className={classes.root} onClick={handleClick} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
        <ItemLabel
          icon={icon}
          text={operation.name}
          className={classNames(classes.name, { [classes.active]: item.isActive })}
        />
        <div style={{ width: 24, margin: '0 4px' }}>
          {visibleClose && <CloseButton size="small" onClick={handleClose} />}
        </div>
      </div>
    </>
  )
}

export default WorkspaceTab
