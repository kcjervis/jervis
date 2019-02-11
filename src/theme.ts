import blue from '@material-ui/core/colors/blue'
import { createMuiTheme } from '@material-ui/core/styles'
import { install } from '@material-ui/styles'

install()

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: 'dark',
    background: {
      paper: 'rgba( 20, 20, 20, 0.1 )'
    },
    primary: blue
  },
  overrides: {
    MuiMenu: {
      paper: {
        background: 'rgba(0, 0, 0, 0.9)'
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
    MuiDrawer: {
      paper: {
        background: 'rgba(0, 0, 0, 0.9)'
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
