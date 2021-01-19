import React from "react"

import { Tooltip, Fab } from "@material-ui/core"
import SaveIcon from "@material-ui/icons/Save"
import { makeStyles } from "@material-ui/core/styles"

import CanvasModalContainer from "./CanvasModalContainer"
import { Dialog } from "../../components"

const useStyles = makeStyles({
  root: {
    position: "relative",
    "& .MuiFab-root": {
      position: "absolute",
      right: -64
    }
  },
  container: {
    "& canvas": {
      width: "100%",
      cursor: "zoom-in"
    }
  }
})

type Props = {
  canvas: HTMLCanvasElement
}

const CanvasViewer: React.FC<Props> = ({ canvas }) => {
  const element = (
    <canvas
      ref={node => {
        node?.getContext("2d")?.drawImage(canvas, 0, 0)
      }}
      width={canvas.width}
      height={canvas.height}
    />
  )

  const classes = useStyles()

  const dataUrl = canvas.toDataURL()

  return (
    <div className={classes.root}>
      <Tooltip title="download">
        <Fab color="secondary" component="a" href={dataUrl} download="canvas.png">
          <SaveIcon />
        </Fab>
      </Tooltip>

      <Dialog maxWidth="lg" button={<div className={classes.container}>{element}</div>}>
        <CanvasModalContainer>{element}</CanvasModalContainer>
      </Dialog>
    </div>
  )
}

export default CanvasViewer
