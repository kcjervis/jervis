import { FleetTypeName } from 'kc-calculator'
import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select, { SelectProps } from '@material-ui/core/Select'

interface FleetTypeSelectProps {
  fleetType: FleetTypeName
  onChange: (fleetType: FleetTypeName) => void
}

const FleetTypeSelect: React.FC<FleetTypeSelectProps> = ({ fleetType, onChange }) => {
  const handleChange = (event: React.ChangeEvent<SelectProps>) => {
    onChange(event.target.value as FleetTypeName)
  }
  return (
    <FormControl>
      <Select variant="outlined" value={fleetType} onChange={handleChange}>
        <MenuItem value={FleetTypeName.Single}>通常艦隊</MenuItem>
        <MenuItem value={FleetTypeName.CarrierTaskForce}>空母機動部隊</MenuItem>
        <MenuItem value={FleetTypeName.SurfaceTaskForce}>水上打撃部隊</MenuItem>
        <MenuItem value={FleetTypeName.TransportEscort}>輸送護衛部隊 </MenuItem>
        <MenuItem value={FleetTypeName.Combined}>敵連合</MenuItem>
      </Select>
    </FormControl>
  )
}

export default FleetTypeSelect
