import { FleetType } from 'kc-calculator'
import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select, { SelectProps } from '@material-ui/core/Select'

interface FleetTypeSelectProps {
  fleetType: FleetType
  onChange: (fleetType: FleetType) => void
}

const FleetTypeSelect: React.FC<FleetTypeSelectProps> = ({ fleetType, onChange }) => {
  const handleChange = (event: React.ChangeEvent<SelectProps>) => {
    onChange(event.target.value as FleetType)
  }
  return (
    <FormControl>
      <Select variant="outlined" value={fleetType} onChange={handleChange}>
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
