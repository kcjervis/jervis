import React from "react"
import clsx from "clsx"

import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { Text } from "./atoms"

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    maxWidth: "100%",
    height: 24,
    fontSize: "1rem"
  },
  typography: {
    marginLeft: theme.spacing(0.5)
  }
}))

type ItemLabelProps = {
  icon: React.ReactElement
  text: string
} & React.ComponentProps<"div">

const ItemLabel: React.FC<ItemLabelProps> = ({ icon, text, className, ...divProps }) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.root, className)} {...divProps}>
      {icon}
      <Text className={classes.typography} noWrap color="inherit">
        {text}
      </Text>
    </div>
  )
}

export default ItemLabel
