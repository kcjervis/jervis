import React from "react"
import { observer } from "mobx-react-lite"
import packageJson from "../../../package.json"

import AppBar, { AppBarProps } from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"

import WorkspaceTab from "./WorkspaceTab"

import { WorkspaceStore } from "../../stores"
import { HorizontalScrollbar } from "../../components"

const appBarHeight = 32

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      display: "flex",
      alignItems: "center",
      height: appBarHeight
    },
    button: {
      height: "100%"
    }
  })
)

type WorkspaceBarPorps = AppBarProps & { workspaceStore: WorkspaceStore }

const WorkspaceBar: React.FC<WorkspaceBarPorps> = ({ workspaceStore, children, ...appBarProps }) => {
  const classes = useStyles()

  const paths = [
    { label: "編成", path: "/operations" },
    { label: "艦娘", path: "/ships" },
    { label: "装備", path: "/equipments" },
    { label: "海域", path: "/maps" },
    { label: "Apps", path: "/apps" }
  ]

  return (
    <AppBar {...appBarProps}>
      <div className={classes.bar}>
        {children}
        <Typography variant="subtitle2">Jervis v{packageJson.version}</Typography>
        <Box flexGrow={1} className={classes.bar}>
          <HorizontalScrollbar>
            {workspaceStore.items.map(item => (
              <WorkspaceTab key={item.id} item={item} />
            ))}
          </HorizontalScrollbar>
        </Box>

        {paths.map(({ label, path }) => (
          <Button className={classes.button} key={path} href={"#" + path}>
            {label}
          </Button>
        ))}
      </div>
    </AppBar>
  )
}

export default observer(WorkspaceBar)
