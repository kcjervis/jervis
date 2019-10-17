import React from "react"

import Box from "@material-ui/core/Box"

import ShipImage from "./ShipImage"
import { Text, Flexbox } from "./atoms"

type ShipNameplateProps = {
  masterId: number
  name: string
}

const ShipNameplate = React.forwardRef<HTMLDivElement, ShipNameplateProps>((props, ref) => {
  const { masterId, name } = props
  return (
    <Flexbox ref={ref} display="inline-flex" width={8 * 30}>
      <ShipImage style={{ width: 8 * 15, flexShrink: 0 }} imageType="banner" masterId={masterId} />
      <Box ml={1}>
        {masterId > 1500 && <Text>ID:{masterId}</Text>}
        <Text>{name}</Text>
      </Box>
    </Flexbox>
  )
})

export default ShipNameplate
