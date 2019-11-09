import React from "react"

import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"

import ShipNameplate from "../ShipNameplate"

type ShipIdCondition = undefined | number | number[]

const shipIdConditionToString = (value: ShipIdCondition) => {
  if (Array.isArray(value)) {
    return `[${value.toString()}]`
  }
  return value
}

type ShipConditionFormProps = {
  value: ShipIdCondition
  onChange?: (value: ShipIdCondition) => void
}

export default function ShipConditionForm({ value, onChange }: ShipConditionFormProps) {
  let element: React.ReactNode
  if (Array.isArray(value)) {
    element = value.map((num, index) => <ShipNameplate key={index} masterId={num} name="" />)
  } else {
    element = value && <ShipNameplate masterId={value} name="" />
  }
  const add = (addition: number) => {
    let next: ShipIdCondition
    if (value === undefined) {
      next = addition
    } else if (typeof value === "number") {
      next = [value, addition]
    } else {
      next = value.concat(addition)
    }
    onChange && onChange(next)
  }

  const handleClick = () => {
    if (Array.isArray(value)) {
      add(value.length + 100)
    } else {
      add(100)
    }
  }
  return (
    <div>
      <Typography>shipId: {shipIdConditionToString(value)}</Typography>
      {element}
      <Button onClick={handleClick}>追加</Button>
    </div>
  )
}
