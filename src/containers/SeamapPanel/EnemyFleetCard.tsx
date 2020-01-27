import React, { useMemo } from "react"
import { MapEnemyFleet, MapEnemyShip } from "@jervis/data"
import { Formation, Side, FleetTypeName, IShip, calcDeadlyPower, AirControlState } from "kc-calculator"

import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import Tooltip from "@material-ui/core/Tooltip"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"

import { ShipNameplate, InfoButton, SaveButton } from "../../components"
import { useOperationStore, useWorkspace } from "../../hooks"
import { ObservableOperation } from "../../stores"

const toShipData = ({ id, level }: MapEnemyShip) => ({ masterId: id, level })

const mapEnemyToOperation = (enemy: MapEnemyFleet, name: string) => {
  const { mainFleet, escortFleet, formation } = enemy

  const isCombinedFleet = escortFleet.length > 0
  const fleets = [{ ships: mainFleet.map(toShipData) }, { ships: escortFleet.map(toShipData) }]

  const operation = ObservableOperation.create({
    name: "",
    side: Side.Enemy,
    fleetType: isCombinedFleet ? FleetTypeName.Combined : FleetTypeName.Single,
    fleets,
    landBase: []
  })

  operation.name = name
  operation.setFormation(formation)

  return operation
}

const toFighterPowerDescription = (fp: number | undefined) => {
  if (fp === undefined) {
    return "制空不明"
  }
  if (fp <= 0) {
    return `制空: ${fp}`
  }
  const bounds = AirControlState.getBoundaryValues(fp)
  return `制空: ${fp} 確保:${bounds.AirSupremacy} 優勢:${bounds.AirSuperiority} 均衡:${bounds.AirParity} 劣勢:${bounds.AirDenial}`
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

const shipsRenderer = (ships: IShip[], formation: Formation) => (
  <>
    {ships.map((ship, index) => (
      <EnemyShipNameplate key={index} ship={ship} formation={formation} />
    ))}
    <Divider />
  </>
)

type EnemyFleetCardProps = {
  className?: string
  enemy: MapEnemyFleet
  name: string
  onSelect?: (operation: ObservableOperation) => void
}

const EnemyFleetCard: React.FC<EnemyFleetCardProps> = ({ className, enemy, name, onSelect }) => {
  const { temporaryOperationStore, persistentOperationStore } = useOperationStore()
  const { openOperation } = useWorkspace()

  const operation = useMemo(() => mapEnemyToOperation(enemy, name), [enemy, name])
  const { mainFleet, escortFleet, getFighterPower, getInterceptionPower } = operation.asKcObject
  const { formation } = operation

  const includesEscort = Boolean(escortFleet)
  const fighterPower = getFighterPower(includesEscort)
  const interceptionPower = getInterceptionPower(includesEscort)

  const handleOpen = () => {
    temporaryOperationStore.push(operation)
    openOperation(operation)
  }
  const handleClick = () => {
    persistentOperationStore.push(operation)
  }
  const handleSelect = () => {
    onSelect && onSelect(operation)
  }

  return (
    <Paper className={className}>
      {onSelect ? (
        <Button onClick={handleSelect}>編成を選択</Button>
      ) : (
        <>
          <InfoButton title="開く" size="small" onClick={handleOpen} />
          <SaveButton title="編成を保存" size="small" onClick={handleClick} />
        </>
      )}
      <div>{shipsRenderer(mainFleet.nonNullableShips, formation)}</div>
      <div>{escortFleet && shipsRenderer(escortFleet.nonNullableShips, formation)}</div>
      <Typography>{formation.name}</Typography>
      <Typography>{toFighterPowerDescription(fighterPower)}</Typography>
      <Typography>{toFighterPowerDescription(interceptionPower)}</Typography>
    </Paper>
  )
}

export default EnemyFleetCard
