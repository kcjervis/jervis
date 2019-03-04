import { IFleet, Side, Formation, nonNullable } from 'kc-calculator'
import {
  fleetAntiAir as calcFleetAntiAir,
  shipAdjustedAntiAir,
  fixedShotdownNumber,
  proportionalShotdownRate
} from 'kc-calculator/dist/combats/AerialCombat/antiAir'
import React, { useState } from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import FormationSelect from '../../components/FormationSelect'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import AntiAirCutin from 'kc-calculator/dist/data/AntiAirCutin'
import union from 'lodash/union'

const AntiAirCutInSelect: React.FC<{
  antiAirCutins: AntiAirCutin[]
  antiAirCutin?: AntiAirCutin
  onChange: (aaci: AntiAirCutin | undefined) => void
}> = ({ antiAirCutins, antiAirCutin, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(AntiAirCutin.fromApi(Number(event.target.value)))
  }
  const currentId = antiAirCutin && antiAirCutin.api
  return (
    <FormControl style={{ width: 120 }}>
      <InputLabel>対空CI</InputLabel>
      <Select variant="outlined" value={currentId} onChange={handleChange}>
        <MenuItem value={0}>なし</MenuItem>
        {antiAirCutins.map(aaci => (
          <MenuItem key={aaci.api} value={aaci.api}>
            {aaci.api}種(*{aaci.fixedAirDefenseModifier}+{aaci.minimumBonus})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const AerialCombatTable: React.FC<{ fleet: IFleet }> = ({ fleet }) => {
  const [formation, setFormation] = useState<Formation>(Formation.LineAhead)
  const [antiAirCutin, setAntiAirCutin] = useState<AntiAirCutin | undefined>()
  const side = Side.Player
  const fleetAntiAir = calcFleetAntiAir(fleet, side, formation.fleetAntiAirModifier)
  const antiAirCutins = union(
    ...fleet.ships.filter(nonNullable).map(ship => AntiAirCutin.getPossibleAntiAirCutins(ship))
  )

  console.log(formation.fleetAntiAirModifier)
  return (
    <>
      <Typography variant="caption" color="secondary">
        連合,新しい対空CI未対応
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FormationSelect formation={formation} onChange={setFormation} />
        <AntiAirCutInSelect antiAirCutin={antiAirCutin} antiAirCutins={antiAirCutins} onChange={setAntiAirCutin} />
        <Typography color="primary">艦隊防空: {fleetAntiAir.toFixed(4)}</Typography>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>艦娘</TableCell>
            <TableCell align="right">加重対空</TableCell>
            <TableCell align="right">割合撃墜</TableCell>
            <TableCell align="right">固定撃墜</TableCell>
            <TableCell align="right">最低保証</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fleet.ships.map(
            (ship, index) =>
              ship && (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {ship.name}
                  </TableCell>
                  <TableCell align="right">{shipAdjustedAntiAir(ship, side)}</TableCell>
                  <TableCell align="right">{proportionalShotdownRate(ship, side).toFixed(4)}</TableCell>
                  <TableCell align="right">
                    {fixedShotdownNumber(ship, side, fleetAntiAir, undefined, antiAirCutin)}
                  </TableCell>
                  <TableCell align="right">{antiAirCutin ? antiAirCutin.minimumBonus : 1}</TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default AerialCombatTable
