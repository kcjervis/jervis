import { FleetRole, FleetTypeName, nonNullable } from "kc-calculator"
import { range, floor } from "lodash-es"
import React from "react"
import { observer } from "mobx-react"

import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Add from "@material-ui/icons/Add"
import Remove from "@material-ui/icons/Remove"
import Tooltip from "@material-ui/core/Tooltip"
import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"

import { StatIcon, GearsSettingDialog, Flexbox, Text, RemoveButton, AddButton } from "../../components"
import ShipForm from "../ShipForm"
import FleetDetail from "./FleetDetail"
import BattleSimulatorPanel from "../BattleSimulatorPanel"

import { ObservableFleet, ObservableOperation, useSettingStore } from "../../stores"
import { withIconButton } from "../../hocs"

const MinusBotton = withIconButton(Remove)

const useStyles = makeStyles({
  root: {
    justifyContent: "center"
  },
  ship: {
    minWidth: 8 * 60
  },
  bottomControl: {
    display: "flex",
    justifyContent: "center"
  },
  iconButton: {
    padding: 8
  }
})

interface FleetFieldProps {
  fleet: ObservableFleet
  operation: ObservableOperation
}

const FleetField: React.FC<FleetFieldProps> = ({ fleet, operation }) => {
  const { ships } = fleet
  const classes = useStyles()

  const addShipSpace = React.useCallback(() => {
    ships.push(undefined)
  }, [fleet])

  const removeShipSpace = React.useCallback(() => {
    if (ships.length > 6) {
      ships.pop()
    }
  }, [fleet])

  const removeAllShips = React.useCallback(() => ships.forEach(ship => ship?.remove()), [fleet])

  const fleetIndex = operation.fleets.indexOf(fleet)
  const { fleetType } = operation
  let fleetRole = FleetRole.MainFleet
  if (fleetIndex === 1 && fleetType !== FleetTypeName.Single) {
    fleetRole = FleetRole.EscortFleet
  }

  // あとで連合用ページを作る
  const isCombinedFleet = operation.asKcObject.isCombinedFleetOperation && [0, 1].includes(fleetIndex)
  const mainFleet = operation.fleets[0].asKcObject
  const escortFleet = operation.fleets[1].asKcObject
  const combinedFleetPlanes = mainFleet.planes.concat(escortFleet.planes)

  const { hqLevel } = operation

  const getEffectiveLos = (factor: number) => {
    if (isCombinedFleet) {
      return mainFleet.effectiveLos(factor, hqLevel) + escortFleet.effectiveLos(factor, hqLevel)
    }
    return fleet.asKcObject.effectiveLos(factor, hqLevel)
  }

  const setting = useSettingStore()

  let tp = fleet.asKcObject.tp
  if (isCombinedFleet) {
    tp = mainFleet.tp + escortFleet.tp
  }

  return (
    <>
      <Flexbox>
        <Flexbox flexGrow={1}>
          <Text>制空: {fleet.asKcObject.fighterPower}</Text>
          <Text style={{ marginLeft: 8 }}>マップ索敵: </Text>
          {range(1, 6).map(nodeDivaricatedFactor => (
            <Tooltip key={nodeDivaricatedFactor} title={`分岐点係数${nodeDivaricatedFactor}`}>
              <Flexbox ml={1}>
                <StatIcon statKey="los" label={nodeDivaricatedFactor} />
                <Text>{floor(getEffectiveLos(nodeDivaricatedFactor), 2)}</Text>
              </Flexbox>
            </Tooltip>
          ))}
        </Flexbox>
        <GearsSettingDialog
          gears={ships.flatMap(ship => ship && ship.gears).filter(nonNullable)}
          restoreSlotSize={() =>
            ships.filter(nonNullable).forEach(ship => {
              ship.slots = ship.slotCapacities.concat()
            })
          }
        />

        <div className={classes.bottomControl}>
          <AddButton className={classes.iconButton} title="艦娘枠を増やす" onClick={addShipSpace} />
          <MinusBotton className={classes.iconButton} title="艦娘枠を減らす" onClick={removeShipSpace} />
          <RemoveButton className={classes.iconButton} title="艦隊の艦娘を全て削除" onClick={removeAllShips} />
        </div>
      </Flexbox>

      <Box>
        <Grid container spacing={1}>
          {ships.map((ship, index) => (
            <Grid key={index} className={classes.ship} item xs={6}>
              <ShipForm key={index} store={fleet} index={index} ship={ship} />
            </Grid>
          ))}
        </Grid>

        <FleetDetail
          operation={operation.asKcObject}
          fleet={fleet.asKcObject}
          fleetRole={fleetRole}
          tp={tp}
          isCombinedFleet={isCombinedFleet}
          combinedFleetPlanes={combinedFleetPlanes}
          defaultFormation={operation.formation}
        />

        {setting.cup4 && <BattleSimulatorPanel fleet={fleet.asKcObject} />}
      </Box>
    </>
  )
}

export default observer(FleetField)
