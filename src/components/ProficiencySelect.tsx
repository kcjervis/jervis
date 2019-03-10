import React, { useCallback } from 'react'
import { Proficiency } from 'kc-calculator/dist/objects/Equipment'

import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Popover from '@material-ui/core/Popover'
import Input from '@material-ui/core/Input'
import { makeStyles } from '@material-ui/styles'

import ProficiencyIcon from './ProficiencyIcon'

import { useAnchorEl, useBaseStyles } from '../hooks'

interface ProficiencySelectProps {
  internal: number
  onChange: (value: number) => void
}

const ProficiencySelect: React.FC<ProficiencySelectProps> = ({ internal, onChange }) => {
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const classes = useBaseStyles()

  const handleMenuItemClick = (internal: number) => () => {
    onClose()
    onChange(internal)
  }
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChange(Number(event.currentTarget.value)),
    [onChange]
  )

  return (
    <>
      <Tooltip title="熟練度選択">
        <ProficiencyIcon className={classes.brightButton} onClick={onClick} internal={internal} />
      </Tooltip>

      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
      >
        <div style={{ height: 40, width: 384 }}>
          {Proficiency.internalBounds.concat(120).map(inter => (
            <Button style={{ height: 40 }} key={inter} onClick={handleMenuItemClick(inter)}>
              <ProficiencyIcon internal={inter} />
            </Button>
          ))}
          <Input
            style={{ marginLeft: 8, width: 56 }}
            inputProps={{ type: 'number', min: 0, max: 120 }}
            value={internal}
            onChange={handleChange}
          />
        </div>
      </Popover>
    </>
  )
}

export default ProficiencySelect
