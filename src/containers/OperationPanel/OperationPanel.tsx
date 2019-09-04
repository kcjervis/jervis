import { FleetTypeName, Side, FleetType } from "kc-calculator"
import { observer } from "mobx-react-lite"
import React, { useContext, useCallback, useState } from "react"

import Checkbox from "@material-ui/core/Checkbox"
import Divider from "@material-ui/core/Divider"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import { makeStyles, Theme } from "@material-ui/core/styles"

import FleetField from "../FleetField"
import LandBaseForm from "../LandBaseForm"
import OperationShareDialog from "../OperationShareDialog"
import OperationDescriptionField from "./OperationDescriptionField"
import { SaveButton, ShareButton, FleetTypeSelect, NumberInput, Flexbox } from "../../components"

import { ObservableOperation, SettingStoreContext } from "../../stores"
import { useOpen, useOperationStore } from "../../hooks"

const useStyles = makeStyles({
  root: {
    margin: 8,
    marginBottom: 8 * 10
  },
  name: { width: 8 * 25 },
  hqLevel: { marginRight: 8, width: 8 * 10 },
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

  const handleChange = (e: unknown, value: number) => {
    operation.activeFleetIndex = value
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

  const handleSideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    const side = checked ? Side.Enemy : Side.Player
    operation.side = side
  }

  const { activeFleetIndex } = operation
  const activeFleet = operation.activeFleet

  const { getFighterPower, isCombinedFleetOperation } = operation.asKcObject

  return (
    <div className={classes.root}>
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
          control={
            <Checkbox checked={settingStore.operationPage.visibleShipStats} onChange={handleVisibleShipStatsChange} />
          }
          label="ステータス表示"
        />
        <FormControlLabel
          control={<Checkbox checked={operation.side === Side.Enemy} onChange={handleSideChange} />}
          label="敵艦隊"
        />

        <ShareButton
          className={classes.iconButton}
          size="medium"
          title="共有URLの生成、デッキビルダー、編成画像出力が使えます"
          onClick={onShareOpen}
        />
        <OperationShareDialog operation={operation} {...shareProps} />

        {isTemporary(operation) && (
          <SaveButton className={classes.iconButton} title="編成をローカルに保存" onClick={handleSave} />
        )}
      </div>

      <Flexbox flexWrap="wrap">
        <Tabs value={activeFleetIndex} onChange={handleChange}>
          {operation.fleets.map((fleet, index) => {
            if (operation.asKcObject.isCombinedFleetOperation && index < 2) {
              return <Tab key={`fleetTab${index}`} label={`連合第${index + 1}`} />
            }
            return <Tab key={`fleetTab${index}`} label={`${index + 1}`} />
          })}
          {operation.landBase.length > 0 && <Tab label="基地航空隊" />}
        </Tabs>

        <Typography className={classes.fighterPower} variant="caption">
          第一艦隊制空: {getFighterPower()} {isCombinedFleetOperation ? `連合戦制空: ${getFighterPower(true)}` : ""}
        </Typography>
      </Flexbox>

      <Divider />

      <Box margin="auto" maxWidth={8 * 125}>
        {activeFleet && <FleetField fleet={activeFleet} operation={operation} />}
        {!activeFleet && <LandBaseForm operation={operation} />}

        <OperationDescriptionField operation={operation} />
      </Box>
    </div>
  )
}

export default observer(OperationPanel)
