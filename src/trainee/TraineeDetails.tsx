import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core'
import {grey} from '@material-ui/core/colors'
import React, {useContext, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {ApplicationState} from '../state'
import {createAddTrainingAction} from '../state/trainings'
import {Trainee} from '../types/Trainee'
import {NewTraining} from './NewTraining'
import {TrainingEntry} from './TrainingEntry'

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
  const trainee = useSelector<ApplicationState, Trainee | undefined>(state =>
    state.trainees.find(trainee => trainee.id === traineeId)
  )
  const dispatch = useDispatch()
  const [datetime, setDatetime] = useState(new Date())
  const [description, setDescription] = useState('')
  const [payedAmount, setPayedAmount] = useState(0)
  const classes = useStyles()

  const addNewTraining = () => {
    dispatch(
      createAddTrainingAction({
        datetime,
        payedAmount,
        description,
      })
    )
  }

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
              <TrainingEntry
                date={new Date(new Date().getTime() - 99999999999)}
              />
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
