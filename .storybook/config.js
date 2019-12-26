import React from "react"
import { configure, addParameters, addDecorator } from '@storybook/react';
import { themes } from '@storybook/theming';
import { MuiThemeProvider } from "@material-ui/core"

import theme from "./theme"

// Option defaults.
addParameters({
  options: {
    theme: themes.dark,
  },
});

addDecorator(story => <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>)

configure(require.context('../src', true, /.stories.tsx$/), module);