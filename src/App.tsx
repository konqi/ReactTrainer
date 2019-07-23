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
} from '@material-ui/icons'
import React, {useEffect} from 'react'
import {Provider, useDispatch, useSelector} from 'react-redux'
import './App.css'
import {ApplicationState, store} from './state'
import {
  createShowTraineeDetailsIntend,
  createShowTraineesIntend,
} from './state/intends/UserIntend'
import {UiState} from './state/ui/types'
import {createUiNavigateAction} from './state/ui/uiActions'
import {CreateTrainee, TraineeDetails, TraineeList} from './trainee'
import {Page} from './types/page'

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
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      flexGrow: 1,
      overflowX: 'auto',
    },
    title: {},
  })
)

const App: React.FC = () => {
  const classes = useStyles()
  const ui = useSelector<ApplicationState, UiState>(state => state.ui)
  const dispatch = useDispatch()
  const handleNavigation = (event: any, value: Page) => {
    switch (value) {
      case Page.Trainees:
        return dispatch(createShowTraineesIntend())
      default:
        // only here for backward compatibility
        return dispatch(createUiNavigateAction(value))
    }
  }

  const {page} = ui
  const {pathname, search} = window.location
  useEffect(() => {
    if (typeof page === 'undefined') {
      if (/^\/trainees/.test(pathname)) {
        dispatch(createShowTraineesIntend())
      } else if (/^\/trainee/.test(pathname)) {
        const params: {[key: string]: string} = {}
        new URLSearchParams(search).forEach((value: string, key: string) => {
          params[key] = value
        })
        dispatch(createShowTraineeDetailsIntend(params.traineeId))
      }
    }
  }, [page, pathname, search, dispatch])

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
