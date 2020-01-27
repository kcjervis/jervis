import React from "react"
import clsx from "clsx"

import Button, { ButtonProps } from "@material-ui/core/Button"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"

import { BaseSelectProps, getDefaultOptionLabel } from "./Select"

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      borderRadius: 0,
      boxSizing: "border-box",
      borderBlockEnd: `solid 2px rgba(0, 0, 0, 0)`
    },
    selected: {
      borderBlockEnd: `solid 2px ${theme.palette.primary.main}`
    }
  })
)

type SelectButtonsProps<OptionType> = BaseSelectProps<OptionType> & { buttonProps?: ButtonProps }

function SelectButtons<OptionType>(props: SelectButtonsProps<OptionType>) {
  const { options, value, onChange, getOptionLabel = getDefaultOptionLabel, buttonProps } = props
  const classes = useStyles()
  return (
    <>
      {options.map((option, index) => (
        <Button
          key={index}
          className={clsx(classes.button, { [classes.selected]: option === value })}
          onClick={() => onChange(option)}
          {...buttonProps}
        >
          {getOptionLabel(option)}
        </Button>
      ))}
    </>
  )
}

export default SelectButtons
