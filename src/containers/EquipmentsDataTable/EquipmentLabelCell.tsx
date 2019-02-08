import { IEquipment } from 'kc-calculator'
import React, { useCallback, useContext } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { DataTableCell } from '../../components/DataTable'
import EquipmentIcon from '../../components/EquipmentIcon'
import EquipmentLabel from '../../components/EquipmentLabel'

import { EquipmentsDataStoreContext } from '../../stores'

interface IEquipmentLabelCell extends RouteComponentProps {
  equipment: IEquipment
}

const EquipmentLabelCell: React.FC<IEquipmentLabelCell> = ({ equipment, history }) => {
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)
  const handleClick = useCallback(() => {
    if (equipmentsDataStore.setEquipment(equipment)) {
      history.push(`/operation`)
      equipmentsDataStore.parent = undefined
      equipmentsDataStore.index = undefined
    }
  }, [equipment])
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
    </DataTableCell>
  )
}

export default withRouter(EquipmentLabelCell)
