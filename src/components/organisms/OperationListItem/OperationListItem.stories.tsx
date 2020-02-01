import React from "react"

import OperationListItem from "./OperationListItem"

export default { title: "organisms|OperationListItem" }

export const basic = () => <OperationListItem operationName="編成名" shipIds={[1, 1, 1, 1, 1, 1]} />

export const longName = () => <OperationListItem operationName="LongLongLongLongName" shipIds={[1, 1, 1, 1, 1, 1]} />
