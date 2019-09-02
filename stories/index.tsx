import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react"
import React from "react"
import { MuiThemeProvider } from "@material-ui/core"

import theme from "../src/theme"
import ImprovementSelect from "../src/components/ImprovementSelect"
import Seamap from "../src/containers/Seamap"

storiesOf("ImprovementSelect", module)
  .addDecorator(story => <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>)
  .add("view", () => <ImprovementSelect value={1} onChange={action("onChange")} />)

storiesOf("Seamap", module)
  .addDecorator(story => <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>)
  .add("view", () => <Seamap />)
