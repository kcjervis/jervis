import React from "react"
import { ShipInformation, AttackPowerModifierRecord, BattleState } from "kc-calculator"
import { observer } from "mobx-react-lite"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { makeStyles, createStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { useSelect } from "../../hooks"
import { Table, SelectButtons } from "../../components"
import ShellingAttackStatus from "./ShellingAttackStatus"
import AswAttackStatus from "./AswAttackStatus"
import TorpedoAttackStatus from "./TorpedoAttackStatus"
import NightAttackStatus from "./NightAttackStatus"

const useStyles = makeStyles(
  createStyles({
    root: {
      width: 8 * 60,
      minHeight: 240
    }
  })
)

type AttackStatusProps = {
  battleState: BattleState
  attacker: ShipInformation
  defender: ShipInformation

  starshell: boolean
  searchlight: boolean
  nightContactModifier?: number

  remainingAmmoModifier?: number
  optionalPowerModifiers?: AttackPowerModifierRecord
  fitGunBonus?: number
}

const AttackStatus: React.FC<AttackStatusProps> = props => {
  const {
    battleState,
    attacker,
    defender,

    starshell,
    searchlight,
    nightContactModifier,

    remainingAmmoModifier,
    optionalPowerModifiers,
    fitGunBonus
  } = props

  const classes = useStyles()
  const defaultType = defender.ship.shipType.isSubmarineClass ? "対潜" : "砲撃戦"
  const attackTypeSelect = useSelect(["砲撃戦", "雷撃戦", "対潜", "夜戦"], defaultType)
  const { engagement } = battleState
  defender.ship.stats.luck

  return (
    <div className={classes.root}>
      <Typography>
        {attacker.ship.name} → {defender.ship.name}
      </Typography>
      <SelectButtons {...attackTypeSelect} />

      {attackTypeSelect.value === "砲撃戦" && (
        <ShellingAttackStatus
          battleState={battleState}
          attacker={attacker}
          defender={defender}
          remainingAmmoModifier={remainingAmmoModifier}
          optionalPowerModifiers={optionalPowerModifiers}
          fitGunBonus={fitGunBonus}
        />
      )}
      {attackTypeSelect.value === "雷撃戦" && (
        <TorpedoAttackStatus
          attacker={attacker}
          defender={defender}
          engagement={engagement}
          remainingAmmoModifier={remainingAmmoModifier}
          optionalPowerModifiers={optionalPowerModifiers}
        />
      )}
      {attackTypeSelect.value === "対潜" && (
        <AswAttackStatus
          attacker={attacker}
          defender={defender}
          engagement={engagement}
          remainingAmmoModifier={remainingAmmoModifier}
          optionalPowerModifiers={optionalPowerModifiers}
        />
      )}
      {attackTypeSelect.value === "夜戦" && (
        <Box mt={1}>
          <NightAttackStatus
            attacker={attacker}
            defender={defender}
            starshell={starshell}
            searchlight={searchlight}
            nightContactModifier={nightContactModifier}
            remainingAmmoModifier={remainingAmmoModifier}
            optionalPowerModifiers={optionalPowerModifiers}
          />
        </Box>
      )}
    </div>
  )
}

export default observer(AttackStatus)
