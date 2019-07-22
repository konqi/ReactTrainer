import React from 'react'
import {
  Container,
  Paper,
  createStyles,
  Theme,
  makeStyles,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from '@material-ui/core'
import {ApplicationState} from '../state'
import {useSelector} from 'react-redux'
import {Trainee} from '../types/Trainee'
import get from 'lodash/get'
import {Session} from '../types/Session'
import format from 'date-fns/format'
import {red, green} from '@material-ui/core/colors'

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
    pullRight: {
      position: 'absolute',
      right: 0,
    },
    payedColumn: {
      position: 'relative',
    },
  })
)

interface ExternalProps {
  traineeId: string
}
export const TraineeHistory: React.FC<ExternalProps> = ({
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
        <Typography variant="h5">Historie</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell size="small">Datum</TableCell>
              <TableCell size="small">Preis</TableCell>
              <TableCell size="medium" className={classes.payedColumn}>
                Gezahlt (Differenz)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map(session => {
              const price = session.price || trainee.price
              const difference = session.payedAmount - price
              return (
                <TableRow key={session.id}>
                  <TableCell>{format(session.datetime, 'D.M.YY')}</TableCell>
                  <TableCell>{price}</TableCell>
                  <TableCell className={classes.payedColumn}>
                    {session.payedAmount}
                    {difference !== 0 && (
                      <span
                        className={`${balanceClass(difference)} ${
                          classes.pullRight
                        }`}
                      >
                        ({difference})
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Container>
    </Paper>
  )
}
