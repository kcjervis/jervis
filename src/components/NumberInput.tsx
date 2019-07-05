import React, { useState, useRef, useEffect, useMemo, useCallback, useDebugValue } from 'react'

import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Flexbox from './Flexbox'

import { IncreaseButton, DecreaseButton } from './IconButtons'
import { useHover } from '../hooks'
import { round } from 'lodash-es'

const useStyles = makeStyles(
  createStyles({
    button: { display: 'block', padding: 0, width: 24, height: 16, lineHeight: 1 }
  })
)

const usePress = (onPress: () => void) => {
  const [isDown, setIsDown] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>()

  useEffect(() => {
    if (isDown) {
      onPress()
      setTimer(setTimeout(() => setIsPressed(true), 500))
    } else {
      setTimer(curTimer => {
        curTimer && clearTimeout(curTimer)
        return undefined
      })
      setIsPressed(false)
    }
  }, [isDown, setTimer])

  useEffect(() => {
    if (!isPressed) {
      return
    }

    setTimer(curTimer => {
      curTimer && clearTimeout(curTimer)
      return setTimeout(onPress, 50)
    })
  }, [isPressed, onPress, setTimer])

  const onMouseDown = useCallback(() => setIsDown(true), [setIsDown])
  const onMouseUp = useCallback(() => setIsDown(false), [setIsDown])

  return {
    onMouseDown,
    onMouseUp,
    onMouseLeave: onMouseUp
  }
}

const stepValue = (value: number, step: number) => {
  const precision = Math.ceil(-Math.log10(Math.abs(step)))
  return round(value + step, precision)
}

type NumberInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
} & Omit<TextFieldProps, 'type' | 'inputProps' | 'onChange' | 'onInput' | 'variant'>

export default function NumberInput({ value, onChange, min, max, step = 1, ...textFieldProps }: NumberInputProps) {
  const classes = useStyles()
  const [isHovered, hoverRef] = useHover()
  const [inputValue, setInputValue] = useState(value.toString())

  const handleBlur = useCallback(() => setInputValue(value.toString()), [value, setInputValue])
  useEffect(handleBlur, [handleBlur])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const str = event.target.value.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      const next = Number(str)
      if (Number.isNaN(next)) {
        return
      }
      setInputValue(str)

      if (str !== '') {
        onChange(next)
      }
    },
    [onChange, setInputValue]
  )

  const changeValue = useCallback(
    (next: number) => {
      next = typeof min === 'number' ? Math.max(next, min) : next
      next = typeof max === 'number' ? Math.min(next, max) : next
      onChange(next)
    },
    [min, max, onChange]
  )
  const increase = useCallback(() => changeValue(stepValue(value, step)), [value, step, changeValue])
  const decrease = useCallback(() => changeValue(stepValue(value, -step)), [value, step, changeValue])

  const increaseProps = usePress(increase)
  const decreaseProps = usePress(decrease)

  return (
    <TextField
      ref={hoverRef}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      style={{ overflow: undefined, width: 8 * 15 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" style={{ visibility: isHovered ? undefined : 'hidden' }}>
            <div>
              <Button className={classes.button} size="small" {...increaseProps}>
                <ArrowDropUpIcon fontSize="inherit" />
              </Button>
              <Button className={classes.button} size="small" {...decreaseProps}>
                <ArrowDropDownIcon fontSize="inherit" />
              </Button>
            </div>
          </InputAdornment>
        )
      }}
      {...textFieldProps}
    />
  )
}
