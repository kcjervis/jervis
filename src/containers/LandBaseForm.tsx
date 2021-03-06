import { nonNullable } from "kc-calculator"
import React from "react"
import { observer } from "mobx-react"

import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import Dialog from "@material-ui/core/Dialog"
import Typography from "@material-ui/core/Typography"

import AerialCombatSimulator, { operationToBattleFleet } from "./AerialCombatSimulator"
import LandBasedAirCorpsCard from "./LandBasedAirCorpsCard"

import { EnemyFleet, GearsSettingDialog, Flexbox } from "../components"
import SeamapPanel from "./SeamapPanel"
import { ObservableOperation } from "../stores"
import { useOpen, useOperationStore } from "../hooks"

interface LandBaseForm {
  operation: ObservableOperation
}

const LandBaseForm: React.FC<LandBaseForm> = ({ operation }) => {
  const { onOpen: onMapOpen, ...mapDialogProps } = useOpen()
  const { onOpen, ...dialogProps } = useOpen()
  const { persistentOperationStore } = useOperationStore()
  const removeEnemy = () => {
    operation.enemy = undefined
  }
  const setEnemy = (enemyOperation: ObservableOperation) => {
    mapDialogProps.onClose()
    dialogProps.onClose()
    operation.enemy = enemyOperation
  }

  const predeck = operation.toDeckJson(false)
  const gears = operation.landBase.flatMap(airCorps => airCorps.gears).filter(nonNullable)

  return (
    <>
      <Flexbox>
        <Button
          size="small"
          href={`https://noro6.github.io/kcTools/?predeck=${predeck}`}
          target="_blank"
          color="primary"
        >
          制空権シミュレータで開く
        </Button>
        <GearsSettingDialog
          gears={gears}
          restoreSlotSize={() => operation.landBase.forEach(airCorps => airCorps.restoreSlotSize())}
        />
      </Flexbox>

      <Flexbox justifyContent="center">
        {operation.landBase.map((airCorps, index) => (
          <LandBasedAirCorpsCard key={index} landBasedAirCorps={airCorps} index={index} />
        ))}
      </Flexbox>

      {operation.enemy ? (
        <>
          <Button onClick={removeEnemy}>敵編成を削除</Button>
          <EnemyFleet battleFleet={operationToBattleFleet(operation.enemy)} />
        </>
      ) : (
        <>
          <Button onClick={onMapOpen}>敵編成を選択</Button>
          <Button onClick={onOpen}>編成一覧から選択</Button>
        </>
      )}

      <AerialCombatSimulator operation={operation} />

      <Dialog PaperProps={{ style: { height: "80vh" } }} fullWidth maxWidth="xl" {...mapDialogProps}>
        <SeamapPanel onSelect={setEnemy} />
      </Dialog>

      <Dialog {...dialogProps}>
        <div>
          {persistentOperationStore.operations.map(operation => (
            <Button key={operation.id} fullWidth onClick={() => setEnemy(operation)}>
              {operation.name}
            </Button>
          ))}
        </div>
      </Dialog>
    </>
  )
}

export default observer(LandBaseForm)
