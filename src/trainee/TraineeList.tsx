import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import * as React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ApplicationState} from '../state'
import {createShowTraineeDetailsIntend} from '../state/intends/UserIntend'
import {Trainee} from '../types/Trainee'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: '85%',
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

  return (
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
    </Paper>
  )
}
