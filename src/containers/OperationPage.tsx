import { observer } from "mobx-react"
import React from "react"
import { RouteComponentProps } from "react-router"
import { Redirect } from "react-router-dom"

import OperationPanel from "./OperationPanel"

import { useOperationStore } from "../hooks"

const OperationPage: React.FC<RouteComponentProps> = props => {
  const { activeOperation } = useOperationStore()
  if (!activeOperation) {
    return <Redirect to="operations" />
  }

  return <OperationPanel operation={activeOperation} />
}

export default observer(OperationPage)
