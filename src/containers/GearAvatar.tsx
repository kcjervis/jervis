import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { GearIcon } from '../components'

import { ObservableGear } from '../stores'

interface GearAvatarProps {
  gear: ObservableGear
}

const GearAvatar: React.FC<GearAvatarProps> = ({ gear }) => {
  const { iconId } = gear.asKcObject
  return (
    <Avatar style={{ width: 32, height: 32, background: 'rgba( 20, 20, 20, 0.1 )' }} alt="Remy Sharp">
      <GearIcon iconId={iconId} />
    </Avatar>
  )
}

export default GearAvatar
