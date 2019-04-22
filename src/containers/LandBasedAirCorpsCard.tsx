import { observer } from 'mobx-react-lite'
import React from 'react'

import { Theme } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select, { SelectProps } from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentField from './EquipmentField'

import { ObservableLandBasedAirCorps } from '../stores'
import { LandBasedAirCorpsMode } from '../stores/ObservableLandBasedAirCorps'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1)
  },
  equipment: {
    margin: theme.spacing(1) * 0.5,
    height: 8 * 5,
    width: 8 * 30
  }
}))

interface LandBasedAirCorpsCard {
  landBasedAirCorps: ObservableLandBasedAirCorps
  index: number
}

const LandBasedAirCorpsCard: React.FC<LandBasedAirCorpsCard> = ({ landBasedAirCorps, index }) => {
  const classes = useStyles()
  const { asKcObject: kcAirCorps } = landBasedAirCorps
  const { combatRadius, minCombatRadius, fighterPower, interceptionPower } = kcAirCorps
  const addedRadius = combatRadius - minCombatRadius
  const addedRadiusLabel = addedRadius > 0 ? `(${minCombatRadius}+${addedRadius})` : ''

  const handleModeChange = (event: React.ChangeEvent<SelectProps>) => {
    landBasedAirCorps.mode = Number(event.target.value)
  }

  return (
    <div className={classes.root}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography>{`第${index + 1}航空隊 行動半径${combatRadius}${addedRadiusLabel}`}</Typography>
          <FormControl variant="outlined">
            <Select
              value={landBasedAirCorps.mode}
              onChange={handleModeChange}
              MenuProps={{
                MenuListProps: {
                  style: { background: 'rgba(0, 0, 0, 0.9)' }
                }
              }}
            >
              <MenuItem value={LandBasedAirCorpsMode.Standby}>待機</MenuItem>
              <MenuItem value={LandBasedAirCorpsMode.Sortie1}>分散</MenuItem>
              <MenuItem value={LandBasedAirCorpsMode.Sortie2}>集中</MenuItem>
            </Select>
          </FormControl>
        </div>
        {landBasedAirCorps.equipments.map((equip, equipIndex) => (
          <EquipmentField
            key={equipIndex}
            className={classes.equipment}
            store={landBasedAirCorps}
            index={equipIndex}
            equipment={equip}
          />
        ))}

        <Typography>{`制空 出撃:${fighterPower} 防空:${interceptionPower}`}</Typography>
      </Card>
    </div>
  )
}

export default observer(LandBasedAirCorpsCard)
