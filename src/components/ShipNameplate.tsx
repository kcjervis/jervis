import { MasterShip } from "kc-calculator"
import React, { useCallback } from "react"

import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"

import ShipImage from "./ShipImage"

type ShipNameplateProps = {
  masterId: number
  name: string
}

const ShipNameplate = React.forwardRef<HTMLDivElement, ShipNameplateProps>((props, ref) => {
  const { masterId, name } = props
  return (
    <div ref={ref} style={{ display: "inline-flex", alignItems: "center", width: 8 * 30 }}>
      <ShipImage style={{ width: 8 * 15, flexShrink: 0 }} imageType="banner" masterId={masterId} />
      <Box ml={1}>
        {masterId > 1500 && (
          <Typography variant="caption" component="div">
            ID:{masterId}
          </Typography>
        )}
        <Typography variant="caption" component="div">
          {name}
        </Typography>
      </Box>
    </div>
  )
})

export default ShipNameplate
