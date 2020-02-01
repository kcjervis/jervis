import { Proficiency } from "kc-calculator/dist/objects/gear"
import React from "react"

import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"

import ProficiencyIcon from "./ProficiencyIcon"
import { StarButtons } from "./ImprovementSelect"

import { ObservableGear } from "../stores"
import { useOpen } from "../hooks"

type GearsSettingDialogProps = {
  gears: ObservableGear[]
  restoreSlotSize?: () => void
}

const GearsSettingDialog: React.FC<GearsSettingDialogProps> = ({ gears, restoreSlotSize }) => {
  const { onOpen, ...dialogProps } = useOpen()

  const handleImprovementChange = (value: number) => {
    gears
      .filter(gear => gear.asKcObject.improvable)
      .forEach(gear => {
        gear.improvement = value
      })
  }

  const handleProficiencyChange = (inter: number) => () => {
    gears.forEach(gear => {
      const kcGear = gear.asKcObject
      if (
        kcGear.is("LandBasedReconnaissanceAircraft") ||
        kcGear.is("Autogyro") ||
        kcGear.is("AntiSubmarinePatrolAircraft")
      ) {
        return
      }

      if (kcGear.is("Aircraft")) {
        gear.proficiency = inter
      }
    })
  }

  return (
    <div>
      <Button size="small" onClick={onOpen}>
        一括設定
      </Button>
      <Dialog {...dialogProps}>
        <DialogTitle>一括設定</DialogTitle>
        <DialogContent>
          <StarButtons onClick={handleImprovementChange} />
          <div>
            {Proficiency.internalBounds.concat(120).map(inter => (
              <Button key={inter} onClick={handleProficiencyChange(inter)}>
                <ProficiencyIcon internal={inter} />
              </Button>
            ))}
          </div>
          {restoreSlotSize && <Button onClick={restoreSlotSize}>機数を戻す</Button>}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GearsSettingDialog
