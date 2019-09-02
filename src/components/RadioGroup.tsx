import React, { useCallback } from "react"

import { Omit } from "@material-ui/core"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Radio from "@material-ui/core/Radio"
import MuiRadioGroup, { RadioGroupProps as MuiRadioGroupProps } from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"

import { BaseSelectProps } from "./Select"

export const getDefaultOptionLabel = (option: unknown): string => {
  switch (typeof option) {
    case "number":
      return option.toString()
    case "string":
      return option
    case "object": {
      if (!option) {
        return ""
      }
      const { label, name } = option as { [K in string]: unknown }
      if (typeof label === "string") {
        return label
      }
      if (typeof name === "string") {
        return name
      }
    }
  }
  return ""
}

type RadioGroupProps<OptionType> = BaseSelectProps<OptionType>

function RadioGroup<OptionType>(props: RadioGroupProps<OptionType>) {
  const { options, value, onChange, label, getOptionLabel = getDefaultOptionLabel, ...muiProps } = props

  const handleChange = useCallback(
    (event: React.ChangeEvent<MuiRadioGroupProps>) => onChange(options[Number(event.target.value)]),
    [options, onChange]
  )

  return (
    <FormControl>
      {label && <InputLabel>{label}</InputLabel>}
      <MuiRadioGroup value={options.indexOf(value).toString()} onChange={handleChange} row>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            label={getOptionLabel(option)}
            value={index.toString()}
            control={<Radio color="primary" />}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  )
}

export default RadioGroup
