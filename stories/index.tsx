import { action } from "@storybook/addon-actions"
import { storiesOf, addDecorator } from "@storybook/react"
import React from "react"
import { MuiThemeProvider } from "@material-ui/core"

import theme from "../src/theme"
import ShipClassSelect from "../src/components/molecules/ShipClassSelect"
import ShipConditionForm from "../src/components/molecules/ShipConditionForm"
import { useState } from "@storybook/addons"

addDecorator(story => <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>)

export default { title: "atoms|ShipClassSelect" }

export const player = () => <ShipClassSelect shipClassId={1} onChange={action("onChange")} />

export const abyssal = () => <ShipClassSelect shipClassId={1001} onChange={action("onChange")} variant="abyssal" />

export const all = () => <ShipClassSelect shipClassId={1} onChange={action("onChange")} variant="all" />
