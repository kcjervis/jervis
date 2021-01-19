import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  zoomIn: {
    "& canvas": {
      width: "100%",
      cursor: "zoom-in"
    }
  },
  zoomOut: {
    cursor: "zoom-out"
  }
})

type Props = {}

const CanvasModalContainer: React.FC<Props> = ({ children }) => {
  const [zoom, setZoom] = useState(true)

  const handleToggle = () => setZoom(value => !value)

  const classes = useStyles()

  return (
    <div className={zoom ? classes.zoomIn : classes.zoomOut} onClick={handleToggle}>
      {children}
    </div>
  )
}

export default CanvasModalContainer
