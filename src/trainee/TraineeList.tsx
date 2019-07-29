import {
  Fab,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Add as AddIcon, Delete as DeleteIcon} from '@material-ui/icons'
import * as React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ApplicationState} from '../state'
import {
  createDeleteTraineeIntend,
  createShowTraineeDetailsIntend,
} from '../state/intends/UserIntend'
import {createUiNavigateAction} from '../state/ui/uiActions'
import {Page} from '../types/page'
import {Trainee} from '../types/Trainee'

export const TraineeListConnected: React.FC = () => {
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
  const deleteTrainee = (traineeId: string) => {
    dispatch(createDeleteTraineeIntend(traineeId))
  }

  return (
    <TraineeList
      trainees={trainees}
      openTrainee={openTrainee}
      deleteTrainee={deleteTrainee}
      newTrainee={newTrainee}
    />
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      // bottom margin needs to be at least the height of the free floating button to avoid blocking access to a table item
      margin: `${theme.spacing(3)}px 0 ${theme.spacing(10)}px 0`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
    },
    table: {
      minWidth: '85%',
    },
    fabButton: {
      position: 'absolute',
      bottom: 0,
      right: theme.spacing(2),
    },
    sticky: {
      position: 'sticky',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    toolColumn: {
      width: 10,
    },
  })
)

interface TraineeListProps {
  trainees: Trainee[]
  openTrainee: (traineeId: string) => void
  deleteTrainee: (traineeId: string) => void
  newTrainee: () => void
}
export const TraineeList: React.FC<TraineeListProps> = ({
  trainees,
  openTrainee,
  newTrainee,
  deleteTrainee,
}: TraineeListProps) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Preis</TableCell>
              <TableCell
                align="right"
                size="small"
                className={classes.toolColumn}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {trainees.map(trainee => (
              <TraineeListRow
                key={trainee.id}
                name={trainee.name}
                price={trainee.price}
                openTrainee={() => openTrainee(trainee.id)}
                deleteTrainee={() => deleteTrainee(trainee.id)}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
      <span className={classes.sticky}>
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.fabButton}
          onClick={newTrainee}
        >
          <AddIcon />
        </Fab>
      </span>
    </React.Fragment>
  )
}

interface TraineeListRowProps {
  name: string
  price: number
  openTrainee: () => void
  deleteTrainee: () => void
}
const TraineeListRow: React.FC<TraineeListRowProps> = ({
  name,
  price,
  openTrainee,
  deleteTrainee,
}: TraineeListRowProps) => (
  <TableRow hover>
    <TableCell component="th" scope="row" onClick={openTrainee}>
      {name}
    </TableCell>
    <TableCell align="right" onClick={openTrainee}>
      {price}
    </TableCell>
    <TableCell align="right">
      <IconButton onClick={deleteTrainee} data-testid="deleteButton">
        <DeleteIcon />
      </IconButton>
    </TableCell>
  </TableRow>
)
