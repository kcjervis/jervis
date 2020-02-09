import React, { useMemo, createContext, useContext } from "react"
import { formattedMaps } from "@jervis/data"
import { action, computed, observable } from "mobx"

import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"

import { Select, SelectButtons } from "../../components"
import EnemyFleetCard from "./EnemyFleetCard"
import { ObservableOperation } from "../../stores"
import { observer } from "mobx-react-lite"
import { SelectProps } from "../../components/Select"

const worlds = [
  { id: 1, name: "鎮守府海域" },
  { id: 2, name: "南西諸島海域" },
  { id: 3, name: "北方海域" },
  { id: 7, name: "南西海域" },
  { id: 4, name: "西方海域" },
  { id: 5, name: "南方海域" },
  { id: 6, name: "中部海域" },
  { id: 46, name: "第二次作戦「南方作戦」" }
]

const worldIds = worlds.map(({ id }) => id)

const getWorldName = (id: number) => {
  const found = worlds.find(world => world.id === id)
  return found ? found.name : ""
}

const mapIdToName = (id: number) => `${Math.floor(id / 10)} - ${id % 10}`

const difficultyToString = (difficulty: number) => {
  switch (difficulty) {
    case 4:
      return "甲"
    case 3:
      return "乙"
    case 2:
      return "丙"
    case 1:
      return "丁"
  }
  return ""
}

class SeamapState {
  @observable public worldId = 6
  @observable public mapId = 65
  @observable public nodeId = "M"
  @observable public difficulty = 4

  get isEvent() {
    return this.mapId > 100
  }

  get nodeName() {
    const { worldId, mapId, nodeId, difficulty } = this
    const area = mapId % 10
    const difficultyText = this.isEvent ? difficultyToString(difficulty) : ""
    return `${worldId}-${area}${nodeId}${difficultyText}`
  }

  @computed get visibleMaps() {
    const { worldId } = this
    return formattedMaps.filter(map => Math.floor(map.mapId / 10) === worldId)
  }

  @computed get visibleNodes() {
    const { mapId } = this
    const foundMap = formattedMaps.find(map => map.mapId === mapId)
    return foundMap ? foundMap.nodes : []
  }

  @computed get visibleEnemies() {
    const { visibleNodes, nodeId, difficulty, isEvent } = this
    const selected = visibleNodes.find(node => node.nodeId === nodeId)
    const nodeEnemies = selected ? selected.enemies : []
    if (isEvent) {
      return nodeEnemies.filter(enemy => enemy.difficulty === difficulty)
    }
    return nodeEnemies
  }

  @action public setWorldId = (id: number) => {
    if (id === this.worldId) {
      return
    }
    this.worldId = id
    this.mapId = id * 10 + 1
  }
  @action public setMapId = (id: number) => {
    this.mapId = id
  }
  @action public setNodeId = (id: string) => {
    this.nodeId = id
  }
  @action public setDifficulty = (diff: number) => {
    this.difficulty = diff
  }

  @computed get worldSelect(): SelectProps<number> {
    const { worldId, setWorldId } = this
    return { options: worldIds, value: worldId, onChange: setWorldId, getOptionLabel: getWorldName }
  }

  @computed get mapSelect(): SelectProps<number> {
    const { mapId, setMapId, visibleMaps } = this
    return { options: visibleMaps.map(map => map.mapId), value: mapId, onChange: setMapId, getOptionLabel: mapIdToName }
  }

  @computed get nodeSelect(): SelectProps<string> {
    const { nodeId, setNodeId, visibleNodes } = this
    return { options: visibleNodes.map(node => node.nodeId), value: nodeId, onChange: setNodeId }
  }

  @computed get difficultySelect(): SelectProps<number> {
    const { difficulty, setDifficulty } = this
    return { options: [4, 3, 2, 1], value: difficulty, onChange: setDifficulty, getOptionLabel: difficultyToString }
  }
}

const SeamapStateContext = createContext(new SeamapState())

const useStyles = makeStyles(theme => ({
  select: {
    minWidth: theme.spacing(10),
    textAlign: "center"
  },
  img: {
    display: "block",
    width: 600
  },
  fleetCard: {
    marginTop: theme.spacing(2)
  }
}))

export type SeamapPanelProps = {
  onSelect?: (operation: ObservableOperation) => void
}

const SeamapPanel: React.FC<SeamapPanelProps> = ({ onSelect }) => {
  const classes = useStyles()
  const state = useContext(SeamapStateContext)

  return (
    <Box m={1}>
      <div>
        <Select {...state.worldSelect} />
        <Select className={classes.select} {...state.mapSelect} />
        {state.isEvent && <Select className={classes.select} {...state.difficultySelect} />}
      </div>
      <img className={classes.img} src={require(`../../images/maps/${state.mapId}.png`)} />
      <div>
        <SelectButtons buttonProps={{ size: "large" }} {...state.nodeSelect} />
      </div>

      {state.visibleEnemies.map((enemy, index) => (
        <EnemyFleetCard
          key={index}
          className={classes.fleetCard}
          enemy={enemy}
          name={state.nodeName}
          onSelect={onSelect}
        />
      ))}
    </Box>
  )
}

export default observer(SeamapPanel)
