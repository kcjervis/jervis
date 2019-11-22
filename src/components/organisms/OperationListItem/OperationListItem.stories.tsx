import { action } from "@storybook/addon-actions"
import { DecoratorFn } from "@storybook/react"
import React from "react"
import { MuiThemeProvider } from "@material-ui/core"

import theme from "../../../theme"
import OperationListItem from "./OperationListItem"

const decorators: DecoratorFn[] = [story => <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>]

export default { title: "organisms|OperationListItem", decorators }

export const basic = () => <OperationListItem operationName="編成名" shipIds={[1, 1, 1, 1, 1, 1]} />

export const longName = () => <OperationListItem operationName="LongLongLongLongName" shipIds={[1, 1, 1, 1, 1, 1]} />
