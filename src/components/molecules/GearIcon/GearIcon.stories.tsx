import React from "react"

import GearIcon from "./GearIcon"
import { NumberInput } from ".."

export default { title: "molecules|GearIcon" }

export const icon = () => {
  const [id, setId] = React.useState(1)
  return (
    <>
      <NumberInput label="id" value={id} onChange={setId} />
      <GearIcon iconId={id} />
    </>
  )
}
