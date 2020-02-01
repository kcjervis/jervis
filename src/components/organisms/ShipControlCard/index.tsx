import React from "react"
import clsx from "clsx"
import { IShip } from "kc-calculator"

import Paper, { PaperProps } from "@material-ui/core/Paper"
import Box from "@material-ui/core/Box"
import Tooltip from "@material-ui/core/Tooltip"
import { makeStyles } from "@material-ui/core/styles"

import { ShipBanner, InfoButton, ClearButton, UpdateButton, Text, Flexbox } from "../.."

type Props = {
  ship: IShip
}

const Component: React.FC<Props> = ({ ship }) => {
  return (
    <Paper>
      <Flexbox alignItems="flex-start">
        <div>
          <Box display="flex" alignItems="center" justifyContent="space-between" mr={2}>
            <Tooltip title={`ID: ${ship.masterId}`}>
              <Text noWrap style={{ maxWidth: 8 * 11 }}>
                {ship.name}
              </Text>
            </Tooltip>
          </Box>

          <ShipBanner size="small" shipId={ship.shipId} />
        </div>
      </Flexbox>
    </Paper>
  )
}

export default Component
