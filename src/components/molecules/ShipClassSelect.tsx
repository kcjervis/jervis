import React, { useMemo } from "react"
import Select from "../Select"
import { ShipClass } from "kc-calculator"

const shipClassIds = ShipClass.all.map(shipClass => shipClass.id)

const getLabel = (id: number) => {
  const shipClass = ShipClass.all.find(sc => sc.id === id)
  return shipClass && shipClass.name
}

type ShipClassSelectProps = {
  shipClassId: number
  onChange: (shipClassId: number) => void
  variant?: "player" | "abyssal" | "all"
}

export default function ShipClassSelect(props: ShipClassSelectProps) {
  const { shipClassId, onChange, variant = "player" } = props
  const visibleIds = useMemo(() => {
    if (variant === "player") {
      return shipClassIds.filter(id => id <= 1000)
    }
    if (variant === "abyssal") {
      return shipClassIds.filter(id => id > 1000)
    }
    return shipClassIds
  }, [variant])
  return <Select options={visibleIds} value={shipClassId} onChange={onChange} getOptionLabel={getLabel} />
}
