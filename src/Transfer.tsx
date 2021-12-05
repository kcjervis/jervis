import React from "react"

import { useOperationStore } from "./hooks"

const Transfer: React.FC = () => {
  const { persistentOperationStore } = useOperationStore()

  if (window.opener) {
    const target: Window = window.opener
    target.postMessage(JSON.parse(JSON.stringify(persistentOperationStore)), "*")
    window.close()
  }

  return null
}

export default Transfer
