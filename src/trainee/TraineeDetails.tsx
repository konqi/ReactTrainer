import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core'
import {grey} from '@material-ui/core/colors'
import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ApplicationState} from '../state'
import {createAddTrainingIntend} from '../state/intends/UserIntend'
import {Trainee} from '../types/Trainee'
import {NewTraining} from './NewTraining'
import {TrainingEntry} from './TrainingEntry'
import {Session} from '../types/Session'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 2),
    },
    calendar: {
      marginBottom: theme.spacing(2),
    },
    current: {
      backgroundColor: grey[200],
      borderRadius: `${theme.shape.borderRadius}px ${
        theme.shape.borderRadius
      }px 0px 0px`,
    },
    form: {
      backgroundColor: grey[200],
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
    },
  })
)

interface ExternalProps {
  traineeId: string
}

export const TraineeDetails: React.FC<ExternalProps> = ({traineeId}) => {
  const trainee = useSelector<ApplicationState, Trainee>(state => {
    return state.trainees[traineeId]
  })
  const {sessions} = useSelector<
    ApplicationState,
    {sessions: Session[] | undefined}
  >(state => {
    const sessions =
      state.trainees[traineeId].sessionsRef &&
      state.trainees[traineeId].sessionsRef!.map(
        (sessionRef: string) => state.sessions[sessionRef]
      )
    // TODO add next & previous session
    return {sessions, nextSession: undefined, previousSession: undefined}
  })
  const dispatch = useDispatch()
  const [datetime, setDatetime] = useState(new Date())
  const [description, setDescription] = useState('')
  const [payedAmount, setPayedAmount] = useState(0)
  const classes = useStyles()

  useEffect(() => {
    setPayedAmount(trainee!.price)
  }, [trainee!.price])

  const addNewTraining = () => {
    if (trainee) {
      dispatch(
        createAddTrainingIntend(
          {
            datetime,
            payedAmount,
            description,
          },
          trainee.id
        )
      )
    }
  }
  console.log(sessions)

  return (
    <Container className={classes.root}>
      {/* <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          {trainee!.name}
        </Typography>
      </Paper> */}
      <Paper>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={4} className={classes.calendar}>
              {sessions && <TrainingEntry date={sessions[0].datetime} />}
            </Grid>
            <Grid item xs={4} className={classes.current}>
              <TrainingEntry date={datetime} />
            </Grid>
            <Grid item xs={4} className={classes.calendar}>
              {/* <TrainingEntry date={new Date(1568029414613)} /> */}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} className={classes.form}>
              <NewTraining
                datetime={datetime}
                onDatetimeChange={setDatetime}
                payedAmount={payedAmount}
                onPayedAmountChange={setPayedAmount}
                description={description}
                onDescriptionChange={setDescription}
                onSubmit={addNewTraining}
              />
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </Container>
  )
}

// receive payment

// show balance (underpayed / overpayed), estimate? remaining session count

// option to cancel / delete entry
