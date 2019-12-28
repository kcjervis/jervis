import React from "react"
import { Proficiency } from "kc-calculator/dist/objects/gear"

import Button from "@material-ui/core/Button"
import Tooltip from "@material-ui/core/Tooltip"
import Popover from "@material-ui/core/Popover"
import { makeStyles } from "@material-ui/core/styles"

import ProficiencyIcon from "./ProficiencyIcon"
import { Flexbox } from "./atoms"
import { NumberInput } from "./molecules"
import { useAnchorEl, useBaseStyles } from "../hooks"

const useStyles = makeStyles({
  input: {
    marginLeft: 8,
    marginRight: 8,
    width: 64
  }
})

const anchorOrigin = {
  vertical: "bottom",
  horizontal: "center"
} as const

const internalBounds = Proficiency.internalBounds.concat(120)

interface ProficiencySelectProps {
  internal: number
  onChange: (value: number) => void
}

const ProficiencySelect: React.FC<ProficiencySelectProps> = ({ internal, onChange }) => {
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const baseClasses = useBaseStyles()
  const classes = useStyles()
  const handleMenuItemClick = (internal: number) => () => {
    onClose()
    onChange(internal)
  }
  return (
    <>
      <Tooltip title="熟練度選択">
        <ProficiencyIcon className={baseClasses.brightButton} onClick={onClick} internal={internal} />
      </Tooltip>

      <Popover anchorOrigin={anchorOrigin} open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}>
        <Flexbox>
          {internalBounds.map(inter => (
            <Button key={inter} onClick={handleMenuItemClick(inter)}>
              <ProficiencyIcon internal={inter} />
            </Button>
          ))}
          <NumberInput className={classes.input} value={internal} onChange={onChange} min={0} max={120} />
        </Flexbox>
      </Popover>
    </>
  )
}

export default ProficiencySelect
