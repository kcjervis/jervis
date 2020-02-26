import React from "react"
import { shipStatKeys, ShipStatKey } from "kc-calculator"
import { observer } from "mobx-react"
import clsx from "clsx"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"

import { Text } from "../../components"
import { ObservableShip } from "../../stores"

import ShipStatDialog from "./ShipStatDialog"

const ShipBasicStats: React.FC<{ ship: ObservableShip }> = ({ ship }) => {
  const shipStatRenderer = (statKey: ShipStatKey) => {
    if (statKey === "antiAir") {
      return (
        <React.Fragment key={statKey}>
          <Grid item={true} xs={6} key={statKey}>
            <ShipStatDialog statKey={statKey} ship={ship} />
          </Grid>
          <Grid item={true} xs={6}>
            <Text style={{ padding: 4 }}>制空: {ship.asKcObject.fighterPower}</Text>
          </Grid>
        </React.Fragment>
      )
    }
    return (
      <Grid item={true} xs={6} key={statKey}>
        <ShipStatDialog statKey={statKey} ship={ship} />
      </Grid>
    )
  }

  return <Grid container={true}>{shipStatKeys.map(shipStatRenderer)}</Grid>
}

export default observer(ShipBasicStats)
