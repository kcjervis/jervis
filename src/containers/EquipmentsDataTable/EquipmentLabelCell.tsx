import { IEquipment } from 'kc-calculator'
import React, { useCallback, useContext } from 'react'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { DataTableCell } from '../../components/DataTable'
import EquipmentIcon from '../../components/EquipmentIcon'

import { ImprovementSelect } from '../../components'
import { EquipmentsDataStoreContext } from '../../stores'

export type EquipmentLabelCellProps = {
  equipment: IEquipment
  onSelect?: (equipment: IEquipment) => void
}

const EquipmentLabelCell: React.FC<EquipmentLabelCellProps> = ({ equipment, onSelect }) => {
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)
  const handleClick = useCallback(() => onSelect && onSelect(equipment), [onSelect, equipment])

  const { activeEquipmentList } = equipmentsDataStore
  const state = activeEquipmentList && activeEquipmentList.getEquipmentState(equipment)
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
        <EquipmentIcon width={24} height={24} iconId={equipment.iconId} />
        <Typography variant="caption">{equipment.name}</Typography>
      </Button>
      {state && <ImprovementSelect value={equipment.improvement.value} onChange={handleImprovementChange} />}
    </DataTableCell>
  )
}

export default EquipmentLabelCell
