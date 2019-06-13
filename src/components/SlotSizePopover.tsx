import React, { useCallback } from 'react'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1'
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1'
import Slider from '@material-ui/lab/Slider'
import { makeStyles } from '@material-ui/styles'
import { useAnchorEl, useBaseStyles } from '../hooks'

type SlotSizePopoverProps = {
  value: number
  max: number
  onChange: (value: number) => void
}

const SlotSizePopover: React.FC<SlotSizePopoverProps> = ({ value, max, onChange }) => {
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const classes = useBaseStyles()
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.currentTarget.value))
    },
    [onChange]
  )

  const handleSliderChange = (event: unknown, value: number | number[]) => {
    if (typeof value === 'number') {
      onChange(value)
    }
  }

  const handleIncrementClick = useCallback(() => {
    onChange(value + 1)
  }, [value, onChange])
  const handleDecrementClick = useCallback(() => {
    onChange(value - 1)
  }, [value, onChange])
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
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
      >
        <TextField style={{ margin: 8 }} label="slot size" value={value} onChange={handleChange} type="number" />
        <Box m={1}>
          <Slider value={value} onChange={handleSliderChange} min={0} max={max} step={1} />
        </Box>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <IconButton onClick={handleDecrementClick}>
            <ExposureNeg1Icon />
          </IconButton>
          <IconButton onClick={handleIncrementClick}>
            <ExposurePlus1Icon />
          </IconButton>
        </div>
      </Popover>
    </>
  )
}

export default SlotSizePopover
