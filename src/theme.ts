import blue from '@material-ui/core/colors/blue'
import { createMuiTheme } from '@material-ui/core/styles'

const clearBackground = 'rgba( 20, 20, 20, 0.1 )'
const darkBackground = 'rgba(0, 0, 0, 0.9)'
const darkPaper = { paper: { background: darkBackground } }

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      paper: clearBackground
    },
    primary: blue
  },
  overrides: {
    MuiMenu: darkPaper,
    MuiDialog: darkPaper,
    MuiDrawer: darkPaper,
    MuiPopover: darkPaper,
    MuiTooltip: {
      tooltip: {
        backgroundColor: darkBackground
      }
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        minWidth: 0
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none'
      },
      textColorInherit: {
        color: 'rgba( 250, 250, 250, 0.7 )',
        minWidth: 20,
        '&$selected': {
          color: 'rgba( 255, 255, 255, 1 )',
          textShadow: '0 0 10px #fff,0 0 15px #fff'
        }
      }
    },

    MuiFormControlLabel: {
      root: {
        marginLeft: 8
      }
    },
    MuiCheckbox: {
      root: {
        padding: 4
      }
    }
  }
})

export default theme
