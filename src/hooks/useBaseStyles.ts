import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"

const styles = createStyles({
  flexbox: {
    display: "flex",
    alignItems: "center"
  },
  column: {
    display: "flex",
    flexDirection: "column"
  },
  bright: {
    filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))"
  },
  brightButton: {
    cursor: "pointer",
    "&:hover": {
      filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))"
    }
  }
})

export default makeStyles(styles)
