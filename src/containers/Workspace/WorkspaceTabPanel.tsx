import React, { useContext, useCallback } from 'react'
import classNames from 'classnames'

import { makeStyles, createStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import { CloseButton } from '../../components/IconButtons'
import { ItemLabel } from '../../components'
import OperationPanel from '../OperationPanel'

import { OperationStoreContext, WorkspaceItem } from '../../stores'

type WorkspaceTabPanelProps = { item: WorkspaceItem }

const WorkspaceTabPanel: React.FC<WorkspaceTabPanelProps> = ({ item }) => {
  const operationStore = useContext(OperationStoreContext)
  if (item.type === 'Operation' || item.type === 'TemporaryOperation') {
    const operation = operationStore.getOperation(item.id)
    return operation ? <OperationPanel operation={operation} /> : null
  }
  return (
    <>
      {item.type} {item.id}
    </>
  )
}

export default WorkspaceTabPanel
