import React from 'react'
import { Shelling, ShellingPowerInformation } from 'kc-calculator'
import { round } from 'lodash-es'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { LabeledValue } from '../../components'

const ShellingStats: React.FC<{ shellingPower: ShellingPowerInformation }> = ({ shellingPower }) => {
  const { antiInstallationModifiers } = shellingPower
  const factors = [
    { label: '基本攻撃力', value: shellingPower.basicPower },
    { label: '連合艦隊補正', value: shellingPower.combinedFleetFactor },

    { label: '艦種加算補正', value: antiInstallationModifiers.shipTypeAdditive },
    { label: '陸上特効加算補正', value: antiInstallationModifiers.additive },
    { label: '陸上特効乗算補正', value: antiInstallationModifiers.multiplicative },

    { label: '陣形補正', value: shellingPower.formationModifier },
    { label: '交戦形態補正', value: shellingPower.engagementModifier },
    { label: '損害補正', value: shellingPower.healthModifier },
    { label: '巡洋艦フィット砲補正', value: shellingPower.cruiserFitBonus },

    { label: '特殊敵乗算特効', value: shellingPower.effectivenessMultiplicative },
    { label: '特殊敵加算特効', value: shellingPower.effectivenessAdditive },
    { label: '特殊攻撃補正', value: shellingPower.specialAttackModifier },
    { label: '徹甲弾補正', value: shellingPower.apShellModifier },
    { label: 'クリティカル補正', value: shellingPower.criticalModifier },
    { label: '熟練度補正', value: shellingPower.proficiencyModifier }
  ].map(factor => ({ ...factor, value: round(factor.value, 4) }))

  return (
    <>
      {factors.map((factor, index) => (
        <LabeledValue key={index} display="inline-block" width={8 * 15} mr={1} {...factor} />
      ))}
    </>
  )
}

export default ShellingStats
