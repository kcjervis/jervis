import React, { useContext } from 'react'

import Box from '@material-ui/core/Box'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { SettingStoreContext } from '../stores'
import { observer } from 'mobx-react-lite'

const SettingPanel = () => {
  const setting = useContext(SettingStoreContext)
  return <Box m={4}></Box>
}

export default observer(SettingPanel)
