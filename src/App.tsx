import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  createStyles,
  CssBaseline,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core'
import {
  CalendarToday as CalendarIcon,
  Money as MoneyIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
} from '@material-ui/icons'
import React from 'react'
import {Provider, useSelector, useDispatch} from 'react-redux'
import './App.css'
import {ApplicationState, store} from './state'
import {UiState} from './state/ui/types'
import {CreateTrainee, TraineeDetails, TraineeList} from './trainee'
import {Page} from './types/page'
import {createUiNavigateAction} from './state/ui/uiActions'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      width: '100vw',
      height: '100vh',
    },
    body: {
      flexGrow: 1,
    },
    title: {},
  })
)

const App: React.FC = () => {
  const classes = useStyles()
  const ui = useSelector<ApplicationState, UiState>(state => state.ui)
  const dispatch = useDispatch()
  const handleNavigation = (event: any, value: Page) => {
    dispatch(createUiNavigateAction(value))
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              ReactTrainer
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" className={classes.body}>
          {ui.page === Page.Trainees && <TraineeList />}
          {ui.page === Page.Create && <CreateTrainee />}
          {ui.page === Page.Trainee && (
            <TraineeDetails {...ui.params as {traineeId: string}} />
          )}
        </Container>
        <Container maxWidth="sm">
          <BottomNavigation showLabels onChange={handleNavigation}>
            <BottomNavigationAction
              label="Personen"
              icon={<PeopleIcon />}
              value={Page.Trainees}
            />
            <BottomNavigationAction
              label="Person anlegen"
              icon={<PersonAddIcon />}
              value={Page.Create}
            />
            <BottomNavigationAction
              label="Finanzen"
              icon={<MoneyIcon />}
              value={Page.Finance}
            />
            <BottomNavigationAction
              label="Kalender"
              icon={<CalendarIcon />}
              value={Page.Calendar}
            />
          </BottomNavigation>
        </Container>
      </div>
    </React.Fragment>
  )
}

const StateWrapper: React.FC = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

export default StateWrapper
