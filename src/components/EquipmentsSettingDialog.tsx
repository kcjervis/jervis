import { Proficiency } from 'kc-calculator/dist/objects/Equipment'
import { improvements } from '@jervis/data'
import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import ProficiencyIcon from './ProficiencyIcon'
import { ImprovementButtons } from './ImprovementSelect'

import { ObservableEquipment } from '../stores'
import { useOpen } from '../hooks'

type EquipmentsSettingDialogProps = {
  equipments: ObservableEquipment[]
}

const EquipmentsSettingDialog: React.FC<EquipmentsSettingDialogProps> = ({ equipments }) => {
  const { onOpen, ...dialogProps } = useOpen()

  const handleImprovementChange = (value: number) => {
    equipments
      .filter(equip => improvements.includes(equip.masterId))
      .forEach(equip => {
        equip.improvement = value
      })
  }

  const handleProficiencyChange = (inter: number) => () => {
    equipments.forEach(equip => {
      const { category } = equip.asKcObject
      if (
        category.isAircraft &&
        !category.either('LandBasedReconnaissanceAircraft', 'Autogyro', 'AntiSubmarinePatrolAircraft')
      ) {
        equip.proficiency = inter
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
          <div>
            <ImprovementButtons onClick={handleImprovementChange} />
          </div>
          {Proficiency.internalBounds.concat(120).map(inter => (
            <Button key={inter} onClick={handleProficiencyChange(inter)}>
              <ProficiencyIcon internal={inter} />
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EquipmentsSettingDialog
