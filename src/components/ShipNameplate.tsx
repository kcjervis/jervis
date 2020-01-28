import React from "react"

import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"

import { Text, Flexbox } from "./atoms"
import { ShipBanner } from "./molecules"

const useStyles = makeStyles({
  banner: {
    flexShrink: 0
  }
})

type ShipNameplateProps = {
  masterId: number
  name: string
}

const ShipNameplate = React.forwardRef<HTMLDivElement, ShipNameplateProps>((props, ref) => {
  const { masterId, name } = props
  const classes = useStyles()
  return (
    <Flexbox ref={ref} display="inline-flex" width={8 * 30}>
      <ShipBanner className={classes.banner} size="small" shipId={masterId} />
      <Box ml={1}>
        {masterId > 1500 && <Text>ID:{masterId}</Text>}
        <Text>{name}</Text>
      </Box>
    </Flexbox>
  )
})

export default ShipNameplate
