import { IHealth } from "kc-calculator/dist/objects/Ship/Health"
import React from "react"

import green from "@material-ui/core/colors/green"
import orange from "@material-ui/core/colors/orange"
import red from "@material-ui/core/colors/red"
import yellow from "@material-ui/core/colors/yellow"
import LinearProgress from "@material-ui/core/LinearProgress"
import Typography from "@material-ui/core/Typography"

import { makeStyles, Theme } from "@material-ui/core/styles"

export const useBackgroundColorStyles = makeStyles({
  lessColor: {
    backgroundColor: green[500]
  },
  minorColor: {
    backgroundColor: yellow[500]
  },
  moderateColor: {
    backgroundColor: orange[500]
  },
  heavyColor: {
    backgroundColor: red[500]
  }
})

const useStyles = makeStyles({
  root: { display: "flex", alignItems: "center" },
  bar: {
    width: "100%",
    marginRight: 8
  },
  colorPrimary: {
    backgroundColor: "rgba( 220, 220, 220, 0.1 )"
  }
})
interface HealthBarProps {
  health: IHealth
}

const HealthBar: React.FC<HealthBarProps> = ({ health }) => {
  const backgroundColors = useBackgroundColorStyles()
  const classes = useStyles()
  const { maxHp, nowHp, damage } = health
  const rate = nowHp / maxHp
  let barColorPrimary: string
  if (damage === "Less") {
    barColorPrimary = backgroundColors.lessColor
  } else if (damage === "Minor") {
    barColorPrimary = backgroundColors.minorColor
  } else if (damage === "Moderate") {
    barColorPrimary = backgroundColors.moderateColor
  } else {
    barColorPrimary = backgroundColors.heavyColor
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
        value={rate * 100}
      />

      <Typography variant="caption">
        {nowHp}/{maxHp}
      </Typography>
    </div>
  )
}

export default HealthBar
