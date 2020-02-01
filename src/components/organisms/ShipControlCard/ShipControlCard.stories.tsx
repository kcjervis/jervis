import React from "react"

import ShipControlCard from "./index"
import kcObjectFactory from "../../../stores/kcObjectFactory"

export default { title: "ShipControlCard" }

const ship = kcObjectFactory.createShip({ masterId: 1 })

export const basic = () => ship && <ShipControlCard ship={ship} />
