import blue from '@material-ui/core/colors/blue'
import indigo from '@material-ui/core/colors/indigo'
import { createMuiTheme } from '@material-ui/core/styles'

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
    MuiButton: {
      root: {
        textTransform: 'none'
      }
    },
    MuiTab: {
      textColorInherit: {
        color: 'rgba( 250, 250, 250, 0.7 )',
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
    }
  }
})

export default theme
