import React from "react"
import { action } from "@storybook/addon-actions"

import { Component } from "./index"
import { makeGear } from "../../../stores/kcObjectFactory"

export default { title: "GearControlBar" }

const gear = makeGear("零式水上偵察機11型乙(熟練)")

export const basic = () => (
  <Component
    gear={gear}
    onGearChange={action("onGearChange")}
    onRemove={action("onRemove")}
    onStarChange={action("onStarChange")}
    onExpChange={action("onExpChange")}
  />
)

export const unequippable = () => <Component gear={gear} equippable={false} />
