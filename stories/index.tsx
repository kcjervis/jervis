import { action } from "@storybook/addon-actions"
import { storiesOf, StoryDecorator } from "@storybook/react"
import React from "react"
import { MuiThemeProvider } from "@material-ui/core"

import theme from "../src/theme"
import ImprovementSelect from "../src/components/ImprovementSelect"

const withTheme: StoryDecorator = story => <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>

storiesOf("ImprovementSelect", module)
  .addDecorator(withTheme)
  .add("view", () => <ImprovementSelect value={1} onChange={action("onChange")} />)
