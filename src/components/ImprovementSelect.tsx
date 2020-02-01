import clsx from "clsx"
import { range } from "lodash-es"
import React from "react"

import Button from "@material-ui/core/Button"
import Tooltip from "@material-ui/core/Tooltip"
import cyan from "@material-ui/core/colors/cyan"
import Popover from "@material-ui/core/Popover"
import Typography from "@material-ui/core/Typography"
import { makeStyles, Theme } from "@material-ui/core/styles"

import { useAnchorEl, useBaseStyles } from "../hooks"

const improvementValueToString = (value: number) => {
  if (value === 10) {
    return "★M"
  }
  return `★${value}`
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.action.disabled,
    width: 8 * 3
  },
  starColor: {
    color: cyan[500]
  },
  selectButton: {
    height: theme.spacing(5)
  }
}))

export const StarButtons: React.FC<{ onClick?: (value: number) => void }> = ({ onClick }) => {
  const classes = useStyles()
  return (
    <>
      {range(11).map(improveValue => (
        <Button
          key={improveValue}
          className={clsx(classes.starColor, classes.selectButton)}
          onClick={() => onClick && onClick(improveValue)}
        >
          {improvementValueToString(improveValue)}
        </Button>
      ))}
    </>
  )
}

interface ImprovementSelectProps {
  value: number
  onChange?: (value: number) => void
}

const ImprovementSelect: React.FC<ImprovementSelectProps> = ({ value, onChange }) => {
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const baseClasses = useBaseStyles()
  const classes = useStyles()

  const handleStarClick = (star: number) => {
    onClose()
    onChange && onChange(star)
  }

  return (
    <>
      <Tooltip title="改修値選択">
        <Typography
          className={clsx(classes.root, { [classes.starColor]: value !== 0 }, baseClasses.brightButton)}
          onClick={onClick}
          variant="subtitle2"
        >
          {improvementValueToString(value)}
        </Typography>
      </Tooltip>

      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
      >
        <StarButtons onClick={handleStarClick} />
      </Popover>
    </>
  )
}

export default ImprovementSelect
