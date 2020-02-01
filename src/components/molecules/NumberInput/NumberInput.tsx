import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import clsx from "clsx"

import TextField, { TextFieldProps } from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import Button from "@material-ui/core/Button"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import { makeStyles } from "@material-ui/core/styles"

import { IncreaseButton, DecreaseButton } from "../../IconButtons"
import { Flexbox } from "../../atoms"
import { round } from "lodash-es"

const useStyles = makeStyles({
  root: {
    "&:hover $adornment": {
      visibility: "visible"
    }
  },
  input: {
    width: 8 * 15
  },
  button: {
    display: "block",
    padding: 0,
    width: 24,
    height: 16,
    lineHeight: 1
  },
  label: {
    whiteSpace: "nowrap"
  },
  adornment: {
    visibility: "hidden"
  }
})

const { setTimeout } = window

const usePress = (onPress: () => void) => {
  const [isDown, setIsDown] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const timer = useRef<number | null>(null)

  const reset = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [timer])

  useEffect(() => {
    if (isDown) {
      onPress()
      timer.current = setTimeout(() => setIsPressed(true), 500)
    } else {
      reset()
      setIsPressed(false)
    }
  }, [isDown, timer])

  useEffect(() => {
    if (!isPressed) {
      return
    }
    reset()
    timer.current = setTimeout(onPress, 50)
  }, [isPressed, timer, onPress])

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
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
} & Omit<TextFieldProps, "type" | "inputProps" | "onChange" | "onInput" | "variant">

export default function NumberInput({ value, onChange, min, max, step = 1, ...textFieldProps }: NumberInputProps) {
  const classes = useStyles()
  const [inputValue, setInputValue] = useState(value.toString())

  const handleBlur = useCallback(() => setInputValue(value.toString()), [value, setInputValue])
  useEffect(handleBlur, [handleBlur])

  const changeValue = useCallback(
    (next: number) => {
      next = typeof min === "number" ? Math.max(next, min) : next
      next = typeof max === "number" ? Math.min(next, max) : next
      onChange && onChange(next)
    },
    [min, max, onChange]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const str = event.target.value.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      const next = Number(str)
      if (!Number.isFinite(next)) {
        return
      }
      setInputValue(str)

      if (str !== "") {
        changeValue(next)
      }
    },
    [changeValue, setInputValue]
  )

  const increase = useCallback(() => changeValue(stepValue(value, step)), [value, step, changeValue])
  const decrease = useCallback(() => changeValue(stepValue(value, -step)), [value, step, changeValue])

  const increaseProps = usePress(increase)
  const decreaseProps = usePress(decrease)

  const inputLabelProps = useMemo(() => ({ className: classes.label }), [])

  return (
    <div className={classes.root}>
      <TextField
        className={clsx(!textFieldProps.fullWidth && classes.input)}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        InputLabelProps={inputLabelProps}
        InputProps={{
          endAdornment: (
            <InputAdornment className={classes.adornment} position="end">
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
    </div>
  )
}
