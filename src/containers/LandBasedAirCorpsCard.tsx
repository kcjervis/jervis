import { observer } from 'mobx-react-lite'
import React from 'react'
import clsx from 'clsx'

import Card, { CardProps } from '@material-ui/core/Card'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { ObservableLandBasedAirCorps } from '../stores'
import { LandBasedAirCorpsMode } from '../stores/ObservableLandBasedAirCorps'
import { useDragAndDrop } from '../hooks'
import { swap } from '../utils'
import EquipmentForm from './EquipmentForm'
import { Select } from '../components'

const getModeLabel = (mode: LandBasedAirCorpsMode) => {
  switch (mode) {
    case LandBasedAirCorpsMode.Standby:
      return '待機'
    case LandBasedAirCorpsMode.Sortie1:
      return '分散'
    case LandBasedAirCorpsMode.Sortie2:
      return '集中'
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
    width: 8 * 40
  }
}))

type LandBasedAirCorpsCard = {
  landBasedAirCorps: ObservableLandBasedAirCorps
  index: number
} & CardProps

const LandBasedAirCorpsCard: React.FC<LandBasedAirCorpsCard> = ({
  landBasedAirCorps,
  index,
  className,
  ...cardProps
}) => {
  const classes = useStyles()
  const [dndProps, dndRef] = useDragAndDrop({
    item: { type: 'LandBasedAirCorps', landBasedAirCorps, index },
    drop: dragItem => {
      const dropStore = landBasedAirCorps.store
      const dropIndex = index
      const dragStore = dragItem.landBasedAirCorps.store
      const dragIndex = dragItem.index
      if (!dropStore || !dragStore) {
        return
      }

      swap(dropStore.landBase, dropIndex, dragStore.landBase, dragIndex)
    }
  })

  const modeOptions = [LandBasedAirCorpsMode.Standby, LandBasedAirCorpsMode.Sortie1, LandBasedAirCorpsMode.Sortie2]

  const { asKcObject: kcAirCorps } = landBasedAirCorps
  const { combatRadius, minCombatRadius, fighterPower, interceptionPower } = kcAirCorps
  const addedRadius = combatRadius - minCombatRadius
  const addedRadiusLabel = addedRadius > 0 ? `(${minCombatRadius}+${addedRadius})` : ''

  const handleModeChange = (mode: LandBasedAirCorpsMode) => {
    landBasedAirCorps.mode = mode
  }

  return (
    <Card ref={dndRef} className={clsx(classes.root, className)} {...cardProps}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Typography>{`第${index + 1}航空隊 行動半径${combatRadius}${addedRadiusLabel}`}</Typography>
        <Select
          options={modeOptions}
          value={landBasedAirCorps.mode}
          getOptionLabel={getModeLabel}
          onChange={handleModeChange}
        />
      </div>
      <EquipmentForm store={landBasedAirCorps} size="medium" />

      <Typography>{`制空 出撃:${fighterPower} 防空:${interceptionPower}`}</Typography>
    </Card>
  )
}

export default observer(LandBasedAirCorpsCard)
