import React from "react"
import clsx from "clsx"

import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"
import BuildIcon from "@material-ui/icons/Build"

import { SlotSizePopover } from "../../components"

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.grey[500]
  },
  icon: {
    fontSize: "0.875rem",
    verticalAlign: "middle"
  }
}))

type Props = {
  className?: string

  value?: number
  max?: number
  onChange?: (value: number) => void
}

const SlotSizeButton: React.FC<Props> = ({ className, value, max, onChange }) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)}>
      {value === undefined || max === undefined ? (
        <BuildIcon className={classes.icon} />
      ) : (
        onChange && <SlotSizePopover value={value} max={max} onChange={onChange} />
      )}
    </div>
  )
}

export default SlotSizeButton
