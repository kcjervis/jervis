import React from "react"
import { formattedMaps, MapEnemyFleet, MapEnemyShip } from "@jervis/data"

import { Button, Typography, Card } from "@material-ui/core"

import { Select, SelectButtons, ShipNameplate } from "../../components"
import { useSelect } from "../../hooks"

const EnemyFleetCard: React.FC<{ enemy: MapEnemyFleet }> = ({ enemy }) => {
  const { mainFleet, escortFleet, formation, difficulty } = enemy

  return (
    <Card>
      <div>
        {mainFleet.map((ship, index) => (
          <ShipNameplate key={index} masterId={ship.id} name="" />
        ))}
      </div>
      <div>
        {escortFleet.map((ship, index) => (
          <ShipNameplate key={index} masterId={ship.id} name="" />
        ))}
      </div>
    </Card>
  )
}

const worlds = [
  { id: 1, name: "鎮守府海域" },
  { id: 2, name: "南西諸島海域" },
  { id: 3, name: "北方海域" },
  { id: 7, name: "南西海域" },
  { id: 4, name: "西方海域" },
  { id: 5, name: "南方海域" },
  { id: 6, name: "中部海域" },
  { id: 45, name: "シングル作戦" }
]

type Maps = typeof formattedMaps

const mapIdToName = (id: number) => `${Math.floor(id / 10)} - ${id % 10}`

export default function Seamap() {
  const worldSelect = useSelect(worlds, worlds[9])
  const foundMaps = formattedMaps.filter(map => Math.floor(map.mapId / 10) === worldSelect.value.id)
  const mapSelect = useSelect(foundMaps)
  const nodeSelect = useSelect(mapSelect.value.nodes)

  return (
    <>
      <div>
        <Select {...worldSelect} getOptionLabel={world => `${world.name} ${world.id}`} />
      </div>
      <div>
        <SelectButtons {...mapSelect} getOptionLabel={map => mapIdToName(map.mapId)} />
      </div>
      <div>
        <SelectButtons buttonProps={{ size: "large" }} {...nodeSelect} getOptionLabel={node => node.nodeId} />
      </div>
      <img src={require(`../../images/maps/${mapSelect.value.mapId}.png`)} />

      {nodeSelect.value.enemies.map((enemy, index) => (
        <EnemyFleetCard key={index} enemy={enemy} />
      ))}
    </>
  )
}
