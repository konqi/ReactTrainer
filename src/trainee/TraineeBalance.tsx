import {
  Container,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import {green, red} from '@material-ui/core/colors'
import get from 'lodash/get'
import React, {useMemo} from 'react'
import {useSelector} from 'react-redux'
import {ApplicationState} from '../state'
import {Session} from '../types/Session'
import {Trainee} from '../types/Trainee'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1, 0),
    },
    negativeBalance: {
      color: red[400],
    },
    positiveBalance: {
      color: green[400],
    },
  })
)

interface ExternalProps {
  traineeId: string
}
export const TraineeBalance: React.FC<ExternalProps> = ({
  traineeId,
}: ExternalProps) => {
  const classes = useStyles()
  const trainee = useSelector<ApplicationState, Trainee>(
    state => state.trainees[traineeId]
  )
  const sessions = useSelector<ApplicationState, Session[]>(state => {
    const sessionRefs = get(trainee, 'sessionsRef')
    if (sessionRefs !== undefined && sessionRefs.length > 0) {
      return sessionRefs.map(sessionRef => state.sessions[sessionRef])
    } else {
      return []
    }
  })

  const totalBalance = useMemo(
    () =>
      sessions.reduce(
        (prev, session) =>
          session.payedAmount - (session.price || trainee.price) + prev,
        0
      ),
    [sessions, trainee]
  )

  const balanceClass = (balance: number) => {
    if (balance > 0) {
      return classes.positiveBalance
    } else if (balance < 0) {
      return classes.negativeBalance
    }
  }

  return (
    <Paper className={classes.root}>
      <Container>
        <Typography variant="h5">
          Kontostand:
          <span className={balanceClass(totalBalance)}> {totalBalance} €</span>
        </Typography>
      </Container>
    </Paper>
  )
}
