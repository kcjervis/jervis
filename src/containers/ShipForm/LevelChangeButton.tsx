import { observer } from 'mobx-react-lite'
import React, { useState, useCallback, useEffect } from 'react'

import { ShipStatKey } from 'kc-calculator'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Input from '@material-ui/core/Input'
import Popover from '@material-ui/core/Popover'
import Slider from '@material-ui/lab/Slider'
import DialogActions from '@material-ui/core/DialogActions'
import Box from '@material-ui/core/Box'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

import { useOpen, useBaseStyles, useInput, useAnchorEl } from '../../hooks'
import { NumberInput } from '../../components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      justifyContent: 'start',
      padding: 0
    }
  })
)

interface LevelChangeButtonProps {
  value: number
  onInput: (value: number) => void
}

const LevelChangeButton: React.FC<LevelChangeButtonProps> = ({ value: init, onInput }) => {
  const classes = useStyles()
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const [value, setValue] = useState(init)

  useEffect(() => {
    setValue(init)
  }, [init])

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(Number(event.target.value))
    },
    [setValue]
  )

  const handleSliderChange = (event: unknown, value: number | number[]) => {
    if (typeof value === 'number') {
      setValue(value)
    }
  }

  const set1 = useCallback(() => setValue(1), [setValue])
  const set99 = useCallback(() => setValue(99), [setValue])
  const set175 = useCallback(() => setValue(175), [setValue])

  const handleClose = useCallback(() => {
    onClose()
    onInput(value)
  }, [value, onClose, onInput])

  const [min, max] = [1, 175]
  const baseProps = { value, max, min }
  return (
    <>
      <Tooltip title="変更">
        <Button className={classes.button} onClick={onClick}>
          Lv {init}
        </Button>
      </Tooltip>

      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
        <Box m={2}>
          <NumberInput fullWidth value={value} onChange={setValue} />
          <Box m={1}>
            <Slider {...baseProps} onChange={handleSliderChange} step={1} />
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Button onClick={set1}>Lv 1</Button>
            <Button onClick={set99}>Lv 99</Button>
            <Button onClick={set175}>Lv 175</Button>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

export default LevelChangeButton
