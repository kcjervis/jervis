import { observer } from 'mobx-react'
import React from 'react'

import Card from '@material-ui/core/Card'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentField from './EquipmentField'

import { ObservableLandBasedAirCorps } from '../stores'
import { LandBasedAirCorpsMode } from '../stores/ObservableLandBasedAirCorps'

const styles = createStyles({
  root: {
    margin: 10
  },
  equipment: {
    margin: 5
  }
})

interface LandBasedAirCorpsCard extends WithStyles<typeof styles> {
  landBasedAirCorps: ObservableLandBasedAirCorps
  index: number
}

const LandBasedAirCorpsCard: React.FC<LandBasedAirCorpsCard> = ({ landBasedAirCorps, index, classes }) => {
  const { asKcObject: kcAirCorps } = landBasedAirCorps
  const { combatRadius, minCombatRadius, fighterPower, interceptionPower } = kcAirCorps
  const addedRadius = combatRadius - minCombatRadius
  const addedRadiusLabel = addedRadius > 0 ? `(${minCombatRadius}+${addedRadius})` : ''

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
          <div key={equipIndex} className={classes.equipment}>
            <EquipmentField parent={landBasedAirCorps} index={equipIndex} equipment={equip} />
          </div>
        ))}

        <Typography>{`制空 出撃:${fighterPower} 防空:${interceptionPower}`}</Typography>
      </Card>
    </div>
  )
}

export default withStyles(styles)(observer(LandBasedAirCorpsCard))
