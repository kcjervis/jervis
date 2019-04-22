import React from 'react'
import clsx from 'clsx'
import { Redirect } from 'react-router-dom'

import { makeStyles, createStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import { CloseButton } from '../../components/IconButtons'
import { ItemLabel } from '../../components'
import OperationPanel from '../OperationPanel'

import { WorkspaceItem, ObservableOperation, ObservableShip } from '../../stores'
import { useWorkspace } from '../../hooks'
import ShipCalculator from '../ShipCalculator'

type WorkspaceTabPanelProps = { item: WorkspaceItem }

const WorkspaceTabPanel: React.FC<WorkspaceTabPanelProps> = ({ item }) => {
  const { itemSelector } = useWorkspace()
  const store = itemSelector(item)
  if (store instanceof ObservableOperation) {
    return <OperationPanel operation={store} />
  }

  if (store instanceof ObservableShip) {
    return <ShipCalculator ship={store.asKcObject} />
  }

  return <Redirect to="operations" />
}

export default WorkspaceTabPanel
