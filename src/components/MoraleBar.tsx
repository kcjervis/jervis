import React from "react"

import blue from "@material-ui/core/colors/blue"
import orange from "@material-ui/core/colors/orange"
import red from "@material-ui/core/colors/red"
import yellow from "@material-ui/core/colors/yellow"
import LinearProgress from "@material-ui/core/LinearProgress"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

import { makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  bar: {
    width: "100%",
    marginRight: 8
  },
  colorPrimary: {
    backgroundColor: "rgba( 220, 220, 220, 0.1 )"
  },
  sparklingColor: {
    backgroundColor: yellow[500]
  },
  normalColor: {
    backgroundColor: blue[500]
  },
  orangeColor: {
    backgroundColor: orange[500]
  },
  redColor: {
    backgroundColor: red[500]
  }
})

export type MoraleBarProps = {
  value: number
}

export default function MoraleBar({ value }: MoraleBarProps) {
  const classes = useStyles()
  let barColorPrimary: string
  if (value >= 50) {
    barColorPrimary = classes.sparklingColor
  } else if (value >= 30) {
    barColorPrimary = classes.normalColor
  } else if (value >= 20) {
    barColorPrimary = classes.orangeColor
  } else {
    barColorPrimary = classes.redColor
  }

  return (
    <div className={classes.root}>
      <LinearProgress
        className={classes.bar}
        classes={{
          colorPrimary: classes.colorPrimary,
          barColorPrimary
        }}
        variant="determinate"
        value={value}
      />
      <Typography variant="caption">{value}</Typography>
    </div>
  )
}
