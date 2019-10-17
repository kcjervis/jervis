import { IHealth } from "kc-calculator/dist/objects/ship/Health"
import React from "react"

import green from "@material-ui/core/colors/green"
import orange from "@material-ui/core/colors/orange"
import red from "@material-ui/core/colors/red"
import yellow from "@material-ui/core/colors/yellow"
import LinearProgress from "@material-ui/core/LinearProgress"
import Typography from "@material-ui/core/Typography"

import { makeStyles } from "@material-ui/core/styles"
import { Text } from "./atoms"

export const useBackgroundColorStyles = makeStyles({
  lessColor: {
    backgroundColor: green[500]
  },
  shouhaColor: {
    backgroundColor: yellow[500]
  },
  chuuhaColor: {
    backgroundColor: orange[500]
  },
  taihaColor: {
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
  const { maxHp, currentHp, damage } = health
  const rate = currentHp / maxHp
  let barColorPrimary: string
  if (damage === "Less") {
    barColorPrimary = backgroundColors.lessColor
  } else if (damage === "Shouha") {
    barColorPrimary = backgroundColors.shouhaColor
  } else if (damage === "Chuuha") {
    barColorPrimary = backgroundColors.chuuhaColor
  } else {
    barColorPrimary = backgroundColors.taihaColor
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

      <Text>
        {currentHp}/{maxHp}
      </Text>
    </div>
  )
}

export default HealthBar
