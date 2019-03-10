import React, { useCallback } from 'react'

import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1'
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1'
import { makeStyles } from '@material-ui/styles'
import { useAnchorEl, useBaseStyles } from '../hooks'

interface SlotSizePopoverProps {
  value: number
  onChange: (value: number) => void
}

const SlotSizePopover: React.FC<SlotSizePopoverProps> = ({ value, onChange }) => {
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const classes = useBaseStyles()
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.currentTarget.value))
    },
    [onChange]
  )
  const handleIncrementClick = useCallback(() => {
    onChange(value + 1)
  }, [value, onChange])
  const handleDecrementClick = useCallback(() => {
    onChange(value - 1)
  }, [value, onChange])
  return (
    <>
      <Tooltip title="搭載を設定">
        <Typography className={classes.brightButton} onClick={onClick}>
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
