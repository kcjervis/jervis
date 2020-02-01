import React from "react"
import clsx from "clsx"
import { IShip, IGear } from "kc-calculator"

import Paper, { PaperProps } from "@material-ui/core/Paper"
import Box from "@material-ui/core/Box"
import Tooltip from "@material-ui/core/Tooltip"
import { makeStyles } from "@material-ui/core/styles"

import { ShipBanner, InfoButton, ClearButton, UpdateButton, Text, Flexbox } from "../.."

type GearState = {
  gearId: number
  star: number
  exp: number
}

type Props = {
  slots: number[]
  gears: Array<IGear | undefined>

  onGearChange?: (index: number, value: number) => void
  onSlotChange?: (index: number, value: number) => void
}
