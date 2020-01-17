import React from "react"
import { AttackPower } from "kc-calculator"
import { round } from "lodash-es"
import clsx from "clsx"

import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

type Props = Pick<AttackPower, "isCapped" | "postcap">

const AttackPowerText: React.FC<Props> = ({ isCapped, postcap }) => {
  const color = isCapped ? "secondary" : "inherit"

  return (
    <Typography variant="inherit" color={color}>
      {round(postcap, 4)}
    </Typography>
  )
}

export default AttackPowerText
