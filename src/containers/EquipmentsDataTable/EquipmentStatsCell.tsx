import { IEquipment } from 'kc-calculator'
import React, { useCallback, useState } from 'react'

import { equipmentStatKeys } from 'kc-calculator'

import Button from '@material-ui/core/Button'

import { DataTableCell } from '../../components/DataTable'
import EquipmentCard from '../../components/EquipmentCard'
import PopperCard from '../../components/PopperCard'
import StatLabel from '../../components/StatLabel'

const EquipmentStatsCell: React.FC<{ equipment: IEquipment }> = ({ equipment }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleOpenClick = useCallback<React.MouseEventHandler<HTMLElement>>(event => {
    setAnchorEl(event.currentTarget)
  }, [])
  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])
  return (
    <>
      <DataTableCell>
        <Button
          fullWidth={true}
          onClick={handleOpenClick}
          style={{ display: 'flex', alignItems: 'center', height: 50, justifyContent: 'flex-start' }}
        >
          {equipmentStatKeys.map(statKey => {
            const value = equipment[statKey]
            if (!value) {
              return null
            }
            return <StatLabel key={statKey} stat={value} statKey={statKey} style={{ margin: 8 }} />
          })}
        </Button>
      </DataTableCell>

      <PopperCard open={Boolean(anchorEl)} anchorEl={anchorEl} onClickAway={handleClose}>
        <EquipmentCard equipment={equipment} />
      </PopperCard>
    </>
  )
}

export default EquipmentStatsCell
