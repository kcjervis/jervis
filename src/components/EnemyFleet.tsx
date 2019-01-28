import React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { TEnemyFleet, TEventDifficulty } from '*maps'
import ShipImage from './ShipImage'

import { FleetType, Formation, Side } from 'kc-calculator'
import BattleFleet from 'kc-calculator/dist/combats/BattleFleet'
import kcObjectFactory, { masterData } from '../stores/kcObjectFactory'

const difficultyToString = (difficulty: TEventDifficulty) => {
  switch (difficulty) {
    case 4:
      return '甲'
    case 3:
      return '乙'
    case 2:
      return '丙'
    case 1:
      return '丁'
  }
}

const masterIdToDataObject = (masterId: number) => {
  const master = masterData.findMasterShip(masterId)
  if (!master) {
    return undefined
  }
  return {
    masterId: master.id,
    level: 1,
    slots: master.slotCapacities,
    equipments: master.equipments.map(equip => {
      if (equip === undefined) {
        return undefined
      }
      if (typeof equip === 'number') {
        return { masterId: equip }
      }
      return { masterId: equip.id, improvement: equip.improvement }
    })
  }
}

const masterIdsToFleet = (ids: number[]) => {
  if (ids.length === 0) {
    return undefined
  }
  return kcObjectFactory.createFleet({ ships: ids.map(masterIdToDataObject) })
}

export const createEnemyBattleFleet = (enemy: TEnemyFleet) => {
  const { ships, formation: formationName } = enemy
  const mainFleet = masterIdsToFleet(ships.slice(0, 6))
  const escortFleet = masterIdsToFleet(ships.slice(6, 12))
  const fleetType = ships.length > 6 ? FleetType.Combined : FleetType.Single
  if (!mainFleet) {
    return undefined
  }
  const battleFleet = new BattleFleet(Side.Enemy, fleetType, [], mainFleet, escortFleet)
  const formation = Formation.all.find(({ name }) => name === formationName)
  if (formation) {
    battleFleet.formation = formation
  }
  return battleFleet
}

const styles = createStyles({})

interface IEnemyFleetProps extends WithStyles<typeof styles> {
  enemy: TEnemyFleet
}

const EnemyFleet: React.FC<IEnemyFleetProps> = ({ enemy }) => {
  const battleFleet = createEnemyBattleFleet(enemy)
  if (!battleFleet) {
    return <Typography align="left">編成を生成できませんでした</Typography>
  }
  const { ships, difficulty, formation: formationName } = enemy
  const escortFleet = masterIdsToFleet(ships.slice(6, 12))

  const allPlanes = battleFleet.allShips.flatMap(({ planes }) => planes)
  const fighterPower = allPlanes
    .filter(({ category }) => !category.isReconnaissanceAircraft)
    .reduce((value, plane) => value + plane.fighterPower, 0)

  const lbasFighterPower = allPlanes.reduce((value, plane) => value + plane.interceptionPower, 0)

  return (
    <div>
      <Typography align="left">
        {difficulty && difficultyToString(difficulty)} {formationName} 制空:{fighterPower} 基地戦:{lbasFighterPower}
      </Typography>
      <div>
        {battleFleet.mainFleet.nonNullableShips.map(({ masterId }, sIndex) => (
          <ShipImage key={sIndex} imageType="banner" masterId={masterId} />
        ))}
      </div>
      <div>
        {escortFleet &&
          escortFleet.nonNullableShips.map(({ masterId }, sIndex) => (
            <ShipImage key={sIndex} imageType="banner" masterId={masterId} />
          ))}
      </div>
    </div>
  )
}

export default withStyles(styles)(EnemyFleet)
