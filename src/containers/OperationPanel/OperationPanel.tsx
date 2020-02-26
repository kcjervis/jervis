import { FleetTypeName, Side, FleetType } from "kc-calculator"
import { observer } from "mobx-react"
import React, { useContext, useCallback, useState } from "react"

import Checkbox from "@material-ui/core/Checkbox"
import Divider from "@material-ui/core/Divider"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"

import FleetField from "../FleetField"
import LandBaseForm from "../LandBaseForm"
import OperationShareDialog from "../OperationShareDialog"
import OperationDescriptionField from "./OperationDescriptionField"
import OperationTab from "./OperationTab"
import { SaveButton, ShareButton, FleetTypeSelect, NumberInput, Flexbox } from "../../components"

import { ObservableOperation, SettingStoreContext } from "../../stores"
import { useOpen, useOperationStore } from "../../hooks"

const useStyles = makeStyles({
  root: {
    margin: 8,
    marginBottom: 8 * 10
  },
  center: {
    margin: "auto",
    maxWidth: 1000
  },
  name: {
    width: 8 * 25
  },
  hqLevel: {
    marginRight: 8,
    width: 8 * 10
  },
  form: {
    display: "flex",
    alignItems: "flex-end"
  },
  iconButton: {
    padding: 4
  },
  fighterPower: {
    marginLeft: 8 * 5
  }
})

interface OperationPanelProps {
  operation: ObservableOperation
}

const OperationPanel: React.FC<OperationPanelProps> = ({ operation }) => {
  const classes = useStyles()
  const { isTemporary, save } = useOperationStore()
  const settingStore = useContext(SettingStoreContext)
  const { onOpen: onShareOpen, ...shareProps } = useOpen()

  const handleSave = () => {
    save(operation)
  }

  const handleFleetTypeChange = (fleetType: FleetTypeName) => {
    operation.fleetType = fleetType
  }

  const handleVisibleShipStatsChange = () => {
    const { operationPage } = settingStore
    operationPage.visibleShipStats = !operationPage.visibleShipStats
  }

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    operation.name = event.target.value
  }

  const handleHqLevelChange = (value: number) => {
    operation.hqLevel = value
  }

  const handleSideChange = () => {
    const next = operation.side === "Player" ? "Enemy" : "Player"
    operation.side = next
  }

  const activeFleet = operation.activeFleet

  const { getFighterPower, isCombinedFleetOperation } = operation.asKcObject

  return (
    <div className={classes.root}>
      <div className={classes.center}>
        <div className={classes.form}>
          <TextField label="編成名" className={classes.name} value={operation.name} onChange={handleChangeName} />
          <NumberInput
            className={classes.hqLevel}
            label="司令部Lv"
            value={operation.hqLevel}
            min={1}
            max={120}
            onChange={handleHqLevelChange}
          />
          <FleetTypeSelect fleetType={operation.fleetType} onChange={handleFleetTypeChange} />

          <FormControlLabel
            label="ステータス表示"
            checked={settingStore.operationPage.visibleShipStats}
            onChange={handleVisibleShipStatsChange}
            control={<Checkbox />}
          />
          <FormControlLabel
            label="敵艦隊"
            checked={operation.side === "Enemy"}
            onChange={handleSideChange}
            control={<Checkbox />}
          />

          <ShareButton
            className={classes.iconButton}
            title="共有URLの生成、デッキビルダー、編成画像出力が使えます"
            onClick={onShareOpen}
          />
          <OperationShareDialog operation={operation} {...shareProps} />

          {isTemporary(operation) && (
            <SaveButton className={classes.iconButton} title="編成をローカルに保存" onClick={handleSave} />
          )}
        </div>

        <Flexbox flexWrap="wrap">
          <OperationTab operation={operation} />

          <Typography className={classes.fighterPower} variant="body2">
            第一艦隊制空: {getFighterPower()} {isCombinedFleetOperation ? `連合戦制空: ${getFighterPower(true)}` : ""}
          </Typography>
        </Flexbox>
      </div>

      <Divider />

      <div className={classes.center}>
        {activeFleet && <FleetField fleet={activeFleet} operation={operation} />}
        {!activeFleet && <LandBaseForm operation={operation} />}

        <OperationDescriptionField operation={operation} />
      </div>
    </div>
  )
}

export default observer(OperationPanel)
