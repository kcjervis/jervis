import React, { useCallback } from "react"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import Popover from "@material-ui/core/Popover"
import IconButton from "@material-ui/core/IconButton"
import ExposurePlus1Icon from "@material-ui/icons/ExposurePlus1"
import ExposureNeg1Icon from "@material-ui/icons/ExposureNeg1"
import Slider from "@material-ui/core/Slider"
import { makeStyles, Theme } from "@material-ui/core/styles"
import { useAnchorEl, useBaseStyles } from "../hooks"
import NumberInput from "./NumberInput"

type SlotSizePopoverProps = {
  value: number
  max: number
  onChange: (value: number) => void
}

const SlotSizePopover: React.FC<SlotSizePopoverProps> = ({ value, max, onChange }) => {
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const classes = useBaseStyles()

  const handleSliderChange = (event: unknown, value: number | number[]) => {
    if (typeof value !== "number") {
      return
    }
    if (value > 0) {
      onChange(Math.min(value, max))
    }
  }
  return (
    <>
      <Tooltip title="搭載を設定">
        <Typography
          className={classes.brightButton}
          color="inherit"
          align="right"
          variant="subtitle2"
          onClick={onClick}
        >
          {value}
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
        <Box m={2}>
          <NumberInput label="slot size" fullWidth value={value} onChange={onChange} min={0} max={max} />
        </Box>

        <Box m={2}>
          <Slider value={value} onChange={handleSliderChange} min={0} max={max} step={1} />
        </Box>
        {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <IconButton onClick={handleDecrementClick}>
            <ExposureNeg1Icon />
          </IconButton>
          <IconButton onClick={handleIncrementClick}>
            <ExposurePlus1Icon />
          </IconButton>
        </div> */}
      </Popover>
    </>
  )
}

export default SlotSizePopover
