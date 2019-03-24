import React, { useContext, useCallback } from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles, createStyles } from '@material-ui/styles'

import { OperationStoreContext, WorkspaceStore, TemporaryOperationStoreContext } from '../../stores'

import OperationFolder from './OperationFolder'
import { CloseButton } from '../../components'

const useStyles = makeStyles(
  createStyles({
    root: {
      marginLeft: 8
    },
    closeButton: {
      display: 'block',
      margin: '0 0 0 auto',
      width: 32,
      height: 32
    }
  })
)

type ExplorerProps = {
  onClose?: () => void
  workspaceStore: WorkspaceStore
}

const Explorer: React.FC<ExplorerProps> = ({ onClose, workspaceStore }) => {
  const store = useContext(OperationStoreContext)
  const temporaryOperationStore = useContext(TemporaryOperationStoreContext)
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CloseButton className={classes.closeButton} size="small" onClick={onClose} />

      <OperationFolder workspace={workspaceStore} store={store} />

      <OperationFolder workspace={workspaceStore} store={temporaryOperationStore} />
    </div>
  )
}

export default observer(Explorer)
