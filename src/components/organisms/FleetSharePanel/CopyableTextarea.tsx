import React from "react"

import InputAdornment from "@material-ui/core/InputAdornment"
import TextField from "@material-ui/core/TextField"

import { CopyTextButton } from "../../"

type Props = {
  label: string
  value: string
}

const Component: React.FC<Props> = ({ label, value }) => {
  const inputProps = React.useMemo(
    () => ({
      endAdornment: (
        <InputAdornment position="end">
          <CopyTextButton value={value} />
        </InputAdornment>
      )
    }),
    [value]
  )

  return <TextField variant="outlined" type="text" label={label} value={value} InputProps={inputProps} />
}

export default Component
