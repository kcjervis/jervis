import { action } from "@storybook/addon-actions"
import { storiesOf, addDecorator } from "@storybook/react"
import React from "react"
import { MuiThemeProvider } from "@material-ui/core"

import theme from "../src/theme"
import ShipClassSelect from "../src/components/molecules/ShipClassSelect"
import ShipConditionForm from "../src/components/molecules/ShipConditionForm"
import { useState } from "@storybook/addons"

addDecorator(story => <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>)

storiesOf("ShipClassSelect", module)
  .add("player", () => <ShipClassSelect shipClassId={1} onChange={action("onChange")} />)
  .add("abyssal", () => <ShipClassSelect shipClassId={1001} onChange={action("onChange")} variant="abyssal" />)
  .add("all", () => <ShipClassSelect shipClassId={1} onChange={action("onChange")} variant="all" />)

storiesOf("ShipConditionForm", module).add("a", () => {
  const [value, setValue] = useState<undefined | number | number[]>(undefined)
  return <ShipConditionForm value={value} onChange={setValue} />
})
