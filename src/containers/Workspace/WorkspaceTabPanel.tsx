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
  const state = itemSelector(item)

  const display = item.isActive ? undefined : ('none' as const)
  let element: JSX.Element = <Redirect to="operations" />

  if (state instanceof ObservableOperation) {
    element = <OperationPanel operation={state} />
  } else if (state instanceof ObservableShip) {
    element = <ShipCalculator ship={state} />
  }

  return <div style={{ display }}>{element}</div>
}

export default WorkspaceTabPanel
