import { IGear } from 'kc-calculator'
import React, { useCallback, useContext } from 'react'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { DataTableCell } from '../../components/DataTable'
import GearIcon from '../../components/GearIcon'

import { ImprovementSelect } from '../../components'
import { GearsDataStoreContext } from '../../stores'

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
        style={{ display: 'flex', height: 50, alignItems: 'center', justifyContent: 'flex-start' }}
      >
        <GearIcon width={24} height={24} iconId={gear.iconId} />
        <Typography variant="caption">{gear.name}</Typography>
      </Button>
      {state && <ImprovementSelect value={gear.improvement.value} onChange={handleImprovementChange} />}
    </DataTableCell>
  )
}

export default GearLabelCell
