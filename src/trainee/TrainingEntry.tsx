import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import {format} from 'date-fns'
import de from 'date-fns/locale/de'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: '2px solid black',
      borderTop: '12px solid black',
      borderRadius: 5,
      boxShadow: theme.shadows[4],
    },
    calendar: {
      alignContent: 'center',
    },
    center: {
      alignSelf: 'center',
    },
  })
)

export interface ExternalProps {
  date: Date
}

export const TrainingEntry: React.FC<ExternalProps> = ({date}) => {
  const classes = useStyles()
  const day = format(date, 'D', {locale: de})
  const month = format(date, 'MMMM', {locale: de})

  return (
    <Paper className={classes.root}>
      <Grid container direction="column" className={classes.calendar}>
        <Grid item className={classes.center}>
          <Typography variant="h4" component="span">
            {day}
          </Typography>
        </Grid>
        <Grid item>{month}</Grid>
      </Grid>
    </Paper>
  )
}
