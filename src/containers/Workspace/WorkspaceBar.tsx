import React from "react"
import { observer } from "mobx-react"

import AppBar, { AppBarProps } from "@material-ui/core/AppBar"
import MuiButton from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import { makeStyles, createStyles, Theme, styled } from "@material-ui/core/styles"

import WorkspaceTab from "./WorkspaceTab"

import { version } from "../../version"
import { WorkspaceStore } from "../../stores"
import { HorizontalScrollbar } from "../../components"

const Button = styled(MuiButton)({ height: "100%" })

const appBarHeight = 32

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      display: "flex",
      alignItems: "center",
      height: appBarHeight
    }
  })
)

type WorkspaceBarPorps = AppBarProps & { workspaceStore: WorkspaceStore }

const WorkspaceBar: React.FC<WorkspaceBarPorps> = ({ workspaceStore, children, ...appBarProps }) => {
  const classes = useStyles()

  const paths = [
    { label: "編成一覧", path: "/operations" },
    { label: "艦娘", path: "/ships" },
    { label: "装備", path: "/equipments" },
    { label: "海域", path: "/maps" },
    { label: "使い方", path: "/help" },
    { label: "Apps", path: "/apps" }
  ]

  return (
    <AppBar {...appBarProps}>
      <div className={classes.bar}>
        {children}
        <Button href={"#"}>Jervis v{version}</Button>
        <Box flexGrow={1} className={classes.bar}>
          <HorizontalScrollbar>
            {workspaceStore.items.map(item => (
              <WorkspaceTab key={item.id} item={item} />
            ))}
          </HorizontalScrollbar>
        </Box>

        {paths.map(({ label, path }) => (
          <Button key={path} href={"#" + path}>
            {label}
          </Button>
        ))}
      </div>
    </AppBar>
  )
}

export default observer(WorkspaceBar)
