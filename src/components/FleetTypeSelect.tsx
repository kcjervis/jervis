import { FleetType } from 'kc-calculator'
import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Select from '@material-ui/core/Select'

interface IFleetTypeSelectProps {
  fleetType: FleetType
  onChange: (fleetType: FleetType) => void
}

const FleetTypeSelect: React.FC<IFleetTypeSelectProps> = ({ fleetType, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as FleetType)
  }
  return (
    <FormControl>
      <Select
        variant="outlined"
        value={fleetType}
        onChange={handleChange}
        MenuProps={{
          MenuListProps: {
            style: { background: 'rgba(0, 0, 0, 0.9)' }
          }
        }}
      >
        <MenuItem value={FleetType.Single}>通常艦隊</MenuItem>
        <MenuItem value={FleetType.CarrierTaskForce}>空母機動部隊</MenuItem>
        <MenuItem value={FleetType.SurfaceTaskForce}>水上打撃部隊</MenuItem>
        <MenuItem value={FleetType.TransportEscort}>輸送護衛部隊 </MenuItem>
        <MenuItem value={FleetType.Combined}>敵連合</MenuItem>
      </Select>
    </FormControl>
  )
}

export default FleetTypeSelect
