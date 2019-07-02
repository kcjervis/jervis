import { IFleet, FleetRole, nonNullable, BattleType, IOperation, Formation, Side, IShip } from 'kc-calculator'
import { AntiAirCutin, FleetAntiAir } from 'kc-calculator/dist/Battle/AerialCombat'
import React from 'react'
import { union } from 'lodash-es'
import { observer } from 'mobx-react-lite'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { Select } from '../../../components'
import { useSelect } from '../../../hooks'
import AerialCombatShipRow from './AerialCombatShipRow'
import calcAntiAirCutinRates from './calcAntiAirCutinRate'
import AntiAirCutinRatePieChart from './AntiAirCutinRatePieChart'

const { calcFleetAntiAir, getCombinedFleetModifier } = FleetAntiAir

const mainFleetModifier = getCombinedFleetModifier(FleetRole.MainFleet, BattleType.NormalBattle)
const escortFleetModifier = getCombinedFleetModifier(FleetRole.EscortFleet, BattleType.NormalBattle)

type AerialCombatTableProps = {
  operation: IOperation

  fleet: IFleet
  fleetRole: FleetRole
  isCombinedFleet?: boolean
  defaultFormation?: Formation
}

const AerialCombatTable: React.FC<AerialCombatTableProps> = ({
  operation,
  fleet,
  isCombinedFleet,
  fleetRole,
  defaultFormation
}) => {
  const { side, mainFleet, escortFleet } = operation

  const formationSelect = useSelect(Formation.values, defaultFormation)
  const formationModifier = formationSelect.value.fleetAntiAirModifier

  let allShips = fleet.ships.filter(nonNullable)
  let fleetAntiAir = calcFleetAntiAir(fleet, side, formationModifier)
  if (isCombinedFleet && escortFleet) {
    allShips = mainFleet.ships.concat(escortFleet.ships).filter(nonNullable)
    fleetAntiAir =
      calcFleetAntiAir(mainFleet, side, formationModifier) + calcFleetAntiAir(escortFleet, side, formationModifier)
  }

  const antiAirCutins = union(...allShips.map(ship => AntiAirCutin.getPossibleAntiAirCutins(ship)))
  const antiAirCutinSelect = useSelect(new Array<AntiAirCutin | undefined>(undefined).concat(antiAirCutins))

  const aaciRateData = calcAntiAirCutinRates(allShips)

  let combinedFleetTable: undefined | React.ReactNode
  if (isCombinedFleet && escortFleet) {
    const getShipRowRenderer = (combinedFleetModifier: number) => (ship: IShip, index: number) => (
      <AerialCombatShipRow
        key={index}
        ship={ship}
        side={side}
        fleetAntiAir={fleetAntiAir}
        combinedFleetModifier={combinedFleetModifier}
        antiAirCutin={antiAirCutinSelect.value}
      />
    )
    combinedFleetTable = (
      <>
        {mainFleet.nonNullableShips.map(getShipRowRenderer(mainFleetModifier))}
        {escortFleet.nonNullableShips.map(getShipRowRenderer(escortFleetModifier))}
      </>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'end' }}>
        <Select label="陣形" {...formationSelect} />
        <Select
          label="対空CI"
          {...antiAirCutinSelect}
          getOptionLabel={option => (option ? `${option.id}種` : '不発')}
        />
        <Typography color="primary">艦隊防空: {fleetAntiAir.toFixed(2)}</Typography>
        {side === Side.Enemy && (
          <Typography style={{ marginLeft: 8 }} color="secondary">
            敵側式
          </Typography>
        )}
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>艦娘</TableCell>
            <TableCell align="right">加重対空</TableCell>
            <TableCell align="right">割合撃墜</TableCell>
            <TableCell align="right">固定撃墜</TableCell>
            <TableCell align="right">最低保証</TableCell>
            <TableCell align="right">対空CI個艦発動率</TableCell>
            <TableCell align="right">噴進弾幕発動率</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isCombinedFleet
            ? combinedFleetTable
            : allShips.map((ship, index) => (
                <AerialCombatShipRow
                  key={index}
                  ship={ship}
                  side={side}
                  fleetAntiAir={fleetAntiAir}
                  antiAirCutin={antiAirCutinSelect.value}
                />
              ))}
        </TableBody>
      </Table>

      <Typography>対空CI艦隊発動率</Typography>
      <AntiAirCutinRatePieChart data={aaciRateData} />
    </>
  )
}

export default observer(AerialCombatTable)
