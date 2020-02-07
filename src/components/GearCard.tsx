import React from "react"

import { gearStatKeys, IGear } from "kc-calculator"

import Card, { CardProps } from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

import StatChip from "./StatChip"
import { RemoveButton, UpdateButton, CloseButton } from "./IconButtons"
import { Text } from "./atoms"
import { GearIcon, GearImage } from "./molecules"

const useStyles = makeStyles(theme => ({
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: theme.spacing(1)
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  details: {
    display: "flex",
    justifyContent: "space-around"
  },
  stats: {
    display: "flex",
    flexDirection: "column"
  },
  image: {
    margin: theme.spacing(1),
    alignSelf: "center",
    maxWidth: 160
  }
}))

interface GearCardProps extends CardProps {
  gear: IGear
  onRemove?: () => void
  onUpdate?: () => void
  onClose?: () => void
}

const tooltipProps = { placement: "top" } as const

const GearCard: React.FC<GearCardProps> = ({ gear, onRemove, onUpdate, onClose, ...cardProps }) => {
  const classes = useStyles()
  const { gearId, category, iconId, name } = gear
  return (
    <Card elevation={12} {...cardProps}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text>
          ID:{gearId} {category.name}
        </Text>

        <div>
          {onRemove && <RemoveButton title="装備を削除" tooltipProps={tooltipProps} onClick={onRemove} />}
          {onUpdate && <UpdateButton title="装備を変更" tooltipProps={tooltipProps} onClick={onUpdate} />}
          {onClose && <CloseButton title="閉じる" tooltipProps={tooltipProps} onClick={onClose} />}
        </div>
      </div>

      <Typography className={classes.title} variant="subtitle1">
        <GearIcon iconId={iconId} />
        {name}
      </Typography>

      <div className={classes.details}>
        {/* ステータス一覧 */}
        <CardContent className={classes.stats}>
          {gearStatKeys.map(statKey => {
            const value = gear[statKey]
            if (value === 0) {
              return null
            }
            return <StatChip key={statKey} statKey={statKey} value={value} />
          })}
        </CardContent>
        <GearImage className={classes.image} gearId={gearId} />
      </div>
    </Card>
  )
}

export default GearCard
