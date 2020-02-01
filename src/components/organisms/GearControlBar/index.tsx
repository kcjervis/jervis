import React from "react"
import clsx from "clsx"
import { IGear } from "kc-calculator"

import { makeStyles, Theme } from "@material-ui/core/styles"

import {
  GearIcon,
  GearTooltip,
  ImprovementSelect,
  ProficiencySelect,
  UpdateButton,
  ClearButton,
  Flexbox,
  Text
} from "../.."

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",

    transition: "0.3s",

    "&:hover": {
      background: "rgba(200, 200, 200, 0.1)"
    },

    "&:hover $buttons": {
      display: "block"
    },
    "&:hover $name": {
      display: "none"
    }
  },
  buttons: {
    display: "none"
  },
  proficiency: {
    marginRight: 4
  },
  icon: {
    marginRight: 4
  },
  name: {
    overflow: "hidden",
    whiteSpace: "nowrap"
  }
}))

type Props = {
  gear: IGear
  equippable?: boolean

  onRemove?: () => void
  onGearChange?: () => void

  onStarChange?: (value: number) => void
  onExpChange?: (value: number) => void
}

const tooltipProps = { placement: "top" } as const

export const Component: React.FC<Props> = ({
  gear,
  equippable = true,
  onRemove,
  onGearChange,
  onStarChange,
  onExpChange
}) => {
  const classes = useStyles()

  const visibleProficiency = gear.proficiency.visible

  return (
    <Flexbox className={classes.root} justifyContent="space-between">
      <Flexbox height="100%" width={`calc(100% - ${visibleProficiency ? 64 : 40}px)`}>
        <GearTooltip gear={gear}>
          <GearIcon className={classes.icon} size="small" iconId={gear.iconId} />
        </GearTooltip>

        <div className={classes.buttons}>
          <UpdateButton title="変更" tooltipProps={tooltipProps} size="small" onClick={onGearChange} />
          <ClearButton title="削除" tooltipProps={tooltipProps} size="small" onClick={onRemove} />
        </div>

        <Text className={classes.name} color={equippable ? "initial" : "secondary"}>
          {gear.name}
        </Text>
      </Flexbox>

      <Flexbox>
        {visibleProficiency && (
          <ProficiencySelect className={classes.proficiency} internal={gear.exp} onChange={onExpChange} />
        )}
        <ImprovementSelect value={gear.star} onChange={onStarChange} />
      </Flexbox>
    </Flexbox>
  )
}

export default Component
