import React from "react"
import { generate, DeckBuilder } from "gkcoi"
import { useAsync } from "react-async-hook"

import CircularProgress from "@material-ui/core/CircularProgress"
import Alert from "@material-ui/lab/Alert"

import CanvasViewer from "./CanvasViewer"

type Props = {
  deck: DeckBuilder
}

const ReactGkcoi: React.FC<Props> = ({ deck }) => {
  const asyncCanvas = useAsync(generate, [deck])

  if (asyncCanvas.status === "not-requested") return null
  if (asyncCanvas.status === "loading")
    return <CircularProgress style={{ display: "block", margin: "auto" }} size={80} />

  if (asyncCanvas.status === "error") {
    console.error(asyncCanvas.error?.stack)
    return (
      <Alert color="error" variant="outlined">
        Error
      </Alert>
    )
  }

  const canvas = asyncCanvas.result
  if (!canvas) return null

  return <CanvasViewer canvas={canvas} />
}

export default ReactGkcoi
