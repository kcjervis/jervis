import { FleetType, Formation, Side } from 'kc-calculator'
import BattleFleet from 'kc-calculator/dist/Battle/BattleFleet'
import React from 'react'

import Typography from '@material-ui/core/Typography'

import { TEventDifficulty } from '*maps'
import ShipImage from './ShipImage'

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

export interface EnemyFleetProps {
  battleFleet: BattleFleet
  difficulty?: TEventDifficulty
}

const EnemyFleet: React.FC<EnemyFleetProps> = ({ battleFleet, difficulty }) => {
  const { escortFleet, formation } = battleFleet
  const allPlanes = battleFleet.allShips.flatMap(ship => ship.planes)
  const fighterPower = allPlanes
    .filter(({ category }) => !category.isReconnaissanceAircraft)
    .reduce((value, plane) => value + plane.fighterPower, 0)

  const lbasFighterPower = allPlanes.reduce((value, plane) => value + plane.interceptionPower, 0)

  return (
    <div>
      <Typography align="left">
        {difficulty && difficultyToString(difficulty)} {formation.name} 制空:{fighterPower} 基地戦:{lbasFighterPower}
      </Typography>
      <div>
        {battleFleet.mainFleet.nonNullableShips.map((ship, shipIndex) => (
          <ShipImage key={shipIndex} imageType="banner" masterId={ship.masterId} />
        ))}
      </div>
      <div>
        {escortFleet &&
          escortFleet.nonNullableShips.map((ship, shipIndex) => (
            <ShipImage key={shipIndex} imageType="banner" masterId={ship.masterId} />
          ))}
      </div>
    </div>
  )
}

export default EnemyFleet
