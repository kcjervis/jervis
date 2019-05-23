import React from 'react'
import { Shelling, ShellingPowerInformation } from 'kc-calculator'
import { round } from 'lodash-es'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { LabeledValue } from '../../components'

const ShellingStats: React.FC<{ shellingPower: ShellingPowerInformation }> = ({ shellingPower }) => {
  const factors = [
    { label: '基本攻撃力', value: shellingPower.basicPower },
    { label: '連合艦隊補正', value: shellingPower.combinedFleetFactor },
    { label: '陣形補正', value: shellingPower.formationModifier },
    { label: '交戦形態補正', value: shellingPower.engagementModifier },
    { label: '巡洋艦フィット砲補正', value: shellingPower.cruiserFitBonus },

    { label: 'クリティカル補正', value: shellingPower.criticalModifier },
    { label: '熟練度補正', value: shellingPower.proficiencyModifier }
  ]

  return (
    <>
      {factors.map((factor, index) => (
        <LabeledValue key={index} display="inline-block" width={8 * 15} mr={1} {...factor} />
      ))}
    </>
  )
}

export default ShellingStats
