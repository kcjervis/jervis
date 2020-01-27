import { IShip, calcDeadlyPower, BattleFleet, Formation } from "kc-calculator"
import React from "react"

import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import Tooltip from "@material-ui/core/Tooltip"

import { TEventDifficulty } from "*maps"
import ShipNameplate from "./ShipNameplate"

const difficultyToString = (difficulty: TEventDifficulty) => {
  switch (difficulty) {
    case 4:
      return "甲"
    case 3:
      return "乙"
    case 2:
      return "丙"
    case 1:
      return "丁"
  }
}

const getFighterPowers = (fp: number) => {
  if (fp <= 0) {
    return ""
  }
  const gte = (multiplier: number) => Math.ceil(fp * multiplier)
  const gt = (multiplier: number) => Math.floor(fp * multiplier) + 1
  return `確保:${gte(3)} 優勢:${gte(1.5)} 均衡:${gt(2 / 3)} 劣勢:${gt(1 / 3)}`
}

const EnemyShipNameplate: React.FC<{ ship: IShip; formation: Formation }> = props => {
  const { ship, formation } = props
  const deadlyPower = calcDeadlyPower(ship)
  const evasionValue = ship.calcEvasionValue(formation.getModifiers("Main").shelling.evasion)
  const title = (
    <>
      <Typography>確殺攻撃力: {deadlyPower}</Typography>
      <Typography>回避項: {evasionValue}</Typography>
    </>
  )
  return (
    <Tooltip title={title}>
      <span>
        <ShipNameplate name={ship.name} masterId={ship.masterId} />
      </span>
    </Tooltip>
  )
}

const shipsRenderer = (ships: IShip[], formation: Formation) => {
  return (
    <>
      {ships.map((ship, index) => (
        <EnemyShipNameplate key={index} ship={ship} formation={formation} />
      ))}
      <Divider />
    </>
  )
}

export interface EnemyFleetProps {
  battleFleet: BattleFleet
  difficulty?: TEventDifficulty
}

const EnemyFleet: React.FC<EnemyFleetProps> = ({ battleFleet, difficulty }) => {
  const { escortFleet, formation } = battleFleet

  const allPlanes = battleFleet.allShips.flatMap(ship => ship.planes)
  const fighterPower = allPlanes
    .filter(plane => !plane.is("ReconnaissanceAircraft"))
    .reduce((value, plane) => value + plane.fighterPower, 0)

  const isUnknown = battleFleet.allShips.flatMap(ship => ship.slots).some(size => size < 0)

  const lbasFighterPower = allPlanes.reduce((value, plane) => value + plane.interceptionPower, 0)

  return (
    <div>
      {shipsRenderer(battleFleet.mainFleet.nonNullableShips, formation)}
      {escortFleet && shipsRenderer(escortFleet.nonNullableShips, formation)}

      <Typography>
        {difficulty && difficultyToString(difficulty)} {formation.name}
      </Typography>
      {isUnknown ? (
        <Typography>不明</Typography>
      ) : (
        <>
          <Typography>
            制空:{fighterPower} {getFighterPowers(fighterPower)}
          </Typography>
          <Typography>
            基地戦:{lbasFighterPower} {getFighterPowers(lbasFighterPower)}
          </Typography>
        </>
      )}
    </div>
  )
}

export default EnemyFleet
