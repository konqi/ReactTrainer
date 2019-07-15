import {
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Add as AddIcon} from '@material-ui/icons'
import * as React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ApplicationState} from '../state'
import {createShowTraineeDetailsIntend} from '../state/intends/UserIntend'
import {createUiNavigateAction} from '../state/ui/uiActions'
import {Page} from '../types/page'
import {Trainee} from '../types/Trainee'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: `${theme.spacing(3)}px 0`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
    },
    table: {
      minWidth: '85%',
    },
    fabButton: {
      margin: `${theme.spacing(3)}px auto`,
    },
  })
)

export const TraineeList: React.FC = () => {
  const classes = useStyles()
  const trainees = useSelector<ApplicationState, Trainee[]>(state =>
    Object.values(state.trainees)
  )
  const dispatch = useDispatch()
  const openTrainee = (traineeId: string) => {
    dispatch(createShowTraineeDetailsIntend(traineeId))
  }
  const newTrainee = () => {
    dispatch(createUiNavigateAction(Page.Create))
  }

  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Preis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainees.map(trainee => (
              <TableRow
                key={trainee.id}
                hover
                onClick={() => openTrainee(trainee.id)}
              >
                <TableCell component="th" scope="row">
                  {trainee.name}
                </TableCell>
                <TableCell align="right">{trainee.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.fabButton}
          onClick={newTrainee}
        >
          <AddIcon />
        </Fab>
      </Paper>
    </React.Fragment>
  )
}
