import React from "react"
import { observer } from "mobx-react"

import { ObservableOperation } from "../../stores"

import ReactGkcoi from "../ReactGkcoi"

import { GkcoiLang, GkcoiTheme } from "../../stores/GkcoiDeck"
import { Select } from "../../components"
import { Paper } from "@material-ui/core"

const themeNames = {
  dark: "Dark",
  "dark-ex": "遠征 dark-ex",
  official: "公式 official",
  "74lc": "七四式(大型) 74lc",
  "74mc": "七四式(中型) 74mc",
  "74sb": "七四式(小型) 74sb"
} as const
const themes = Object.keys(themeNames) as GkcoiTheme[]
const getThemeLabel = (theme: GkcoiTheme) => themeNames[theme]

const langDict: Record<GkcoiLang, string> = {
  jp: "日本語",
  en: "English",
  kr: "한국어",
  scn: "中文(简体)"
}
const langs = Object.keys(langDict) as GkcoiLang[]
const getLangLabel = (lang: GkcoiLang) => langDict[lang]

type GkcoiPanelProps = {
  operation: ObservableOperation
}

const GkcoiPanel: React.FC<GkcoiPanelProps> = ({ operation }) => {
  return (
    <Paper style={{ padding: 8, minHeight: 480 }}>
      <div style={{ marginBottom: 8 }}>
        <Select
          label="Theme"
          variant="outlined"
          options={themes}
          value={operation.gkcoiTheme}
          onChange={theme => {
            operation.gkcoiTheme = theme
          }}
          getOptionLabel={getThemeLabel}
        />
        <Select
          label="Language"
          variant="outlined"
          options={langs}
          value={operation.gkcoiLang}
          onChange={lang => {
            operation.gkcoiLang = lang
          }}
          getOptionLabel={getLangLabel}
        />
      </div>

      <ReactGkcoi deck={operation.toGkcoiDeck()} />
    </Paper>
  )
}

export default observer(GkcoiPanel)
