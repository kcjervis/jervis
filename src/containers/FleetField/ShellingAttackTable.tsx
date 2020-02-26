import { AirControlState, FleetRole, IFleet, IShip, DayCombatSpecialAttack, nonNullable } from "kc-calculator"
import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"

import Typography from "@material-ui/core/Typography"

import { toPercent } from "../../utils"
import { Table, AttackChip, Flexbox } from "../../components"

type ShellingAttackTableProps = {
  fleet: IFleet
  fleetRole: FleetRole
}

type AttackRate = ReturnType<typeof DayCombatSpecialAttack.calcRate>
const attackRateRenderer = (attackRate: AttackRate) => {
  return attackRate.entries().map(([attack, rate], index) => (
    <div key={index}>
      <AttackChip attack={attack} />
      <Typography variant="inherit" style={{ display: "inline-block", width: 50, marginLeft: 8 }}>
        {toPercent(rate)}
      </Typography>
    </div>
  ))
}

const Component: React.FC<ShellingAttackTableProps> = ({ fleet, fleetRole }) => {
  const fleetLosModifier = DayCombatSpecialAttack.calcFleetLosModifier(fleet)
  const attackData = fleet.ships
    .map((ship, index) => {
      if (!ship) {
        return
      }
      const isFlagship = index === 0 && fleetRole === FleetRole.MainFleet
      const calcRate = (airState: AirControlState) =>
        DayCombatSpecialAttack.calcRate(ship, fleetLosModifier, airState, isFlagship)
      return {
        name: ship.name,
        airSupremacy: calcRate(AirControlState.AirSupremacy),
        airSuperiority: calcRate(AirControlState.AirSuperiority)
      }
    })
    .filter(nonNullable)

  return (
    <>
      <Typography variant="body2">艦隊索敵補正 {fleetLosModifier}</Typography>
      <Table
        data={attackData}
        columns={[
          { label: "艦娘", getValue: datum => datum.name, align: "left" },
          { label: "観測項(確保)", getValue: datum => datum.airSupremacy.baseValue },
          { label: "発動率(確保)", getValue: datum => attackRateRenderer(datum.airSupremacy) },
          { label: "合計発動率(確保)", getValue: datum => toPercent(datum.airSupremacy.total) },
          { label: "観測項(優勢)", getValue: datum => datum.airSuperiority.baseValue },
          { label: "発動率(優勢)", getValue: datum => attackRateRenderer(datum.airSuperiority) },
          { label: "合計発動率(優勢)", getValue: datum => toPercent(datum.airSuperiority.total) }
        ]}
      />
    </>
  )
}

export default observer(Component)
