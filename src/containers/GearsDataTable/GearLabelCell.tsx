import { IGear } from "kc-calculator"
import React, { useCallback, useContext } from "react"

import Button from "@material-ui/core/Button"

import { DataTableCell } from "../../components/DataTable"

import { GearIcon, ImprovementSelect, Text } from "../../components"
import { GearsDataStoreContext } from "../../stores"

export type GearLabelCellProps = {
  gear: IGear
  onSelect?: (gear: IGear) => void
}

const GearLabelCell: React.FC<GearLabelCellProps> = ({ gear, onSelect }) => {
  const gearsDataStore = useContext(GearsDataStoreContext)
  const handleClick = useCallback(() => onSelect && onSelect(gear), [onSelect, gear])

  const { activeGearList } = gearsDataStore
  const state = activeGearList && activeGearList.getGearState(gear)
  const handleImprovementChange = (value: number) => {
    if (state) {
      state.improvement = value
    }
  }
  return (
    <DataTableCell>
      <Button
        fullWidth={true}
        onClick={handleClick}
        style={{ display: "flex", height: 50, alignItems: "center", justifyContent: "flex-start" }}
      >
        <GearIcon size="small" iconId={gear.iconId} />
        <Text>{gear.name}</Text>
      </Button>
      {state && <ImprovementSelect value={gear.improvement.value} onChange={handleImprovementChange} />}
    </DataTableCell>
  )
}

export default GearLabelCell
