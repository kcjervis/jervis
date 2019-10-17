import { FleetTypeName, FleetType } from "kc-calculator"
import React from "react"

import Select from "./Select"

interface FleetTypeSelectProps {
  fleetType: FleetTypeName
  onChange: (fleetType: FleetTypeName) => void
}

const types = [
  FleetTypeName.Single,
  FleetTypeName.CarrierTaskForce,
  FleetTypeName.SurfaceTaskForce,
  FleetTypeName.TransportEscort,
  FleetTypeName.Combined
]

const getFleetTypeJp = (key: FleetTypeName) => FleetType[key].name

const FleetTypeSelect: React.FC<FleetTypeSelectProps> = ({ fleetType, onChange }) => {
  return <Select value={fleetType} options={types} onChange={onChange} getOptionLabel={getFleetTypeJp} />
}

export default FleetTypeSelect
