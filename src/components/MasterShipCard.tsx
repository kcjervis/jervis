import React from "react"

import { MasterShip, shipStatKeys } from "kc-calculator"

import CardContent from "@material-ui/core/CardContent"

import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

import ShipImage from "./ShipImage"
import StatChip from "./StatChip"
import { Flexbox } from "./atoms"

const useStyles = makeStyles(theme => ({
  root: {},
  stats: {
    display: "flex",
    flexDirection: "column"
  },
  shipImage: {
    width: "auto",
    height: "auto",
    maxWidth: 8 * 40,
    maxHeight: 8 * 40
  }
}))

type MasterShipCardProps = {
  ship: MasterShip
}

const MasterShipCard: React.FC<MasterShipCardProps> = ({ ship }) => {
  const classes = useStyles()
  const { shipId, name, shipType } = ship
  return (
    <div className={classes.root}>
      <Flexbox>
        <Typography align="center">
          ID {shipId} {shipType.name}
        </Typography>
        <Typography variant="h5"> {name}</Typography>
      </Flexbox>

      <Flexbox>
        {/* ステータス一覧 */}
        <CardContent className={classes.stats}>
          {shipStatKeys.map(statKey => {
            const value = ship[statKey]
            return <StatChip key={statKey} statKey={statKey} value={value} />
          })}
          <Typography>搭載 {ship.slotCapacities.toString()}</Typography>
        </CardContent>

        <ShipImage className={classes.shipImage} masterId={shipId} imageType="full" />
      </Flexbox>
    </div>
  )
}

export default MasterShipCard
