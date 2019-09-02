import React from "react"
import clsx from "clsx"

import { Theme, makeStyles, useTheme } from "@material-ui/core/styles"
import Box, { BoxProps } from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 40,
    boxShadow: `inset 0 -1px ${theme.palette.text.secondary}`
  },
  label: {
    fontSize: "0.7rem"
  },
  value: {
    marginRight: theme.spacing(1)
  }
}))

type LabeledValueProps = {
  label: React.ReactNode
  value: React.ReactNode
} & BoxProps

const LabeledValue: React.FC<LabeledValueProps> = ({ label, value, className, ...boxProps }) => {
  const classes = useStyles()
  return (
    <Box className={clsx(classes.root, className)} {...boxProps}>
      <Typography className={classes.label} variant="caption" component="div" noWrap color="textSecondary">
        {label}
      </Typography>
      <Typography className={classes.value} variant="body2" align="right">
        {value}
      </Typography>
    </Box>
  )
}

export default LabeledValue
