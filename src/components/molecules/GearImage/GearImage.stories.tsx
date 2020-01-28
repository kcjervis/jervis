import React from "react"

import GearImage from "./GearImage"
import { NumberInput } from ".."

export default { title: "molecules|GearImage" }

export const icon = () => {
  const [id, setId] = React.useState(1)
  return (
    <>
      <NumberInput label="id" value={id} onChange={setId} />
      <GearImage gearId={id} />
    </>
  )
}
