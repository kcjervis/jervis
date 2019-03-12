import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { EquipmentIcon } from '../components'

import { ObservableEquipment } from '../stores'

interface EquipmentAvatarProps {
  equipment: ObservableEquipment
}

const EquipmentAvatar: React.FC<EquipmentAvatarProps> = ({ equipment }) => {
  const { iconId } = equipment.asKcObject
  return (
    <Avatar style={{ width: 32, height: 32, background: 'rgba( 20, 20, 20, 0.1 )' }} alt="Remy Sharp">
      <EquipmentIcon iconId={iconId} />
    </Avatar>
  )
}

export default EquipmentAvatar
