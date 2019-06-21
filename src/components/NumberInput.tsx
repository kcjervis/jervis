import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'

import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Flexbox from './Flexbox'

const useStyles = makeStyles(createStyles({}))

const createEventHandler = (onChange: (value: number) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
  const str = event.target.value.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  if (!/[0-9]/.test(str)) {
    return
  }
  const next = Number(str)
  if (str === '' || Number.isNaN(next)) {
    return
  }
  onChange(next)
}

type NumberInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
} & Omit<TextFieldProps, 'type' | 'inputProps' | 'onChange' | 'onInput' | 'variant'>

export default function NumberInput({ value, onChange, min, max, step, ...textFieldProps }: NumberInputProps) {
  const classes = useStyles()
  const [inputValue, setInputValue] = useState(value.toString())

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const str = event.target.value.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      const next = Number(str)
      if (Number.isNaN(next) || /\D/.test(str)) {
        return
      }
      setInputValue(str)

      if (str === '') {
        return
      }
      onChange(next)
    },
    [onChange, setInputValue]
  )

  useEffect(() => setInputValue(value.toString()), [value, setInputValue])

  return (
    <TextField
      type="number"
      value={inputValue}
      onChange={handleChange}
      inputProps={{ min, max, step }}
      {...textFieldProps}
    />
  )
}
