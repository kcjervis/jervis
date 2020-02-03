import React from "react"
import { action } from "@storybook/addon-actions"

import { Component } from "./index"
import { makeGear } from "../../../stores/kcObjectFactory"

export default { title: "GearControlBar" }

export const basic = () => (
  <Component
    gear={makeGear("12.7cm連装砲A型改三(戦時改修)+高射装置")}
    onGearChange={action("onGearChange")}
    onRemove={action("onRemove")}
    onStarChange={action("onStarChange")}
    onExpChange={action("onExpChange")}
  />
)

export const plane = () => (
  <Component
    gear={makeGear("零式水上偵察機11型乙(熟練)")}
    onGearChange={action("onGearChange")}
    onRemove={action("onRemove")}
    onStarChange={action("onStarChange")}
    onExpChange={action("onExpChange")}
  />
)

export const unequippable = () => <Component gear={makeGear("零式水上偵察機11型乙(熟練)")} equippable={false} />
