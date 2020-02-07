import React from "react"
import { StoresContext } from "../stores"

export const useStores = () => React.useContext(StoresContext)
