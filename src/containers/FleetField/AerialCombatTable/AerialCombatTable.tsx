import { IFleet, FleetRole, nonNullable, BattleType, IOperation, Formation } from 'kc-calculator'
import { getCombinedFleetModifier } from 'kc-calculator/dist/Battle/AerialCombat/antiAir'
import AntiAirCutin from 'kc-calculator/dist/Battle/AerialCombat/AntiAirCutin'
import { fleetAntiAir as calcFleetAntiAir } from 'kc-calculator/dist/Battle/AerialCombat/antiAir'
import React from 'react'
import { union } from 'lodash-es'

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

type AerialCombatTableProps = {
  operation: IOperation

  fleet: IFleet
  isCombinedFleet?: boolean
  fleetRole: FleetRole
}

const AerialCombatTable: React.FC<AerialCombatTableProps> = ({ operation, fleet, isCombinedFleet, fleetRole }) => {
  const { side, mainFleet, escortFleet } = operation

  const formationSelect = useSelect(Formation.values)
  const formationModifier = formationSelect.value.fleetAntiAirModifier

  let allShips = fleet.ships.filter(nonNullable)
  let fleetAntiAir = calcFleetAntiAir(fleet, side, formationModifier)
  let combinedFleetModifier: number | undefined
  if (isCombinedFleet && escortFleet) {
    allShips = mainFleet.ships.concat(escortFleet.ships).filter(nonNullable)
    fleetAntiAir =
      calcFleetAntiAir(mainFleet, side, formationModifier) + calcFleetAntiAir(escortFleet, side, formationModifier)
    combinedFleetModifier = getCombinedFleetModifier(BattleType.NormalBattle, fleetRole)
  }

  const antiAirCutins = union(...allShips.map(ship => AntiAirCutin.getPossibleAntiAirCutins(ship)))
  const antiAirCutinSelect = useSelect(new Array<AntiAirCutin | undefined>(undefined).concat(antiAirCutins))

  const aaciRateData = calcAntiAirCutinRates(allShips)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select label="陣形" {...formationSelect} />
        <Select
          label="対空CI"
          {...antiAirCutinSelect}
          getOptionLabel={option => (option ? `${option.id}種` : '不発')}
        />
        <Typography color="primary">
          艦隊防空: {fleetAntiAir.toFixed(2)}
          {isCombinedFleet ? ` 連合艦隊補正: ${combinedFleetModifier}(通常戦固定)` : null}
        </Typography>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {allShips.map((ship, index) => (
            <AerialCombatShipRow
              key={index}
              ship={ship}
              side={side}
              fleetAntiAir={fleetAntiAir}
              combinedFleetModifier={combinedFleetModifier}
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

export default AerialCombatTable
