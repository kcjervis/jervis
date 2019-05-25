import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'
import { createMuiTheme } from '@material-ui/core/styles'

const clearBackground = 'rgba( 20, 20, 20, 0.1 )'
const darkBackground = 'rgba(10, 10, 15, 0.95)'
const dialogPaperBackground = 'rgba(66, 66, 77, 0.95)'
const darkPaper = { paper: { background: darkBackground } }

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      paper: clearBackground
    },
    primary: blue,
    action: {
      disabled: 'rgba(180, 180, 216, 0.5)'
    }
  },
  overrides: {
    MuiTypography: {
      root: {
        color: 'white'
      }
    },
    MuiPaper: {
      root: {
        scrollbarColor: `${grey[700]} ${grey[900]}`,
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: 8
        },
        '&::-webkit-scrollbar-track': {
          background: grey[900],
          borderLeft: `solid 1px ${grey[700]}`
        },
        '&::-webkit-scrollbar-thumb': {
          background: grey[700]
        }
      }
    },
    MuiMenu: darkPaper,
    MuiMenuItem: {
      root: {
        color: 'white'
      }
    },
    MuiDialog: {
      paper: { background: dialogPaperBackground }
    },
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
    MuiExpansionPanel: {
      root: {
        background: 'rgba( 20, 20, 20, 0 )',
        '&:before': undefined
      }
    },
    MuiExpansionPanelSummary: {
      root: {
        height: 8 * 3,
        minHeight: 0,
        '&$expanded': {
          minHeight: 0
        }
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

    MuiTableCell: {
      root: {
        padding: 0
      }
    },
    MuiTableRow: {
      root: {
        '&:hover': {
          background: 'rgba(200, 200, 200, 0.08)'
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
