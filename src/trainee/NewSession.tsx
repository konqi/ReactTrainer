import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core'
import {Add as AddIcon} from '@material-ui/icons'
import {format, isFuture} from 'date-fns'
import React, {ChangeEvent, FormEvent} from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {alignContent: 'center'},
  })
)

interface ExternalProps {
  datetime?: Date
  description?: string
  payedAmount?: number
  onChange: (property: string, value: string | number | Date) => void
  onSubmit?: () => void
}

export const NewSession: React.FC<ExternalProps> = ({
  datetime = new Date(),
  description = undefined,
  payedAmount = '',
  onChange = () => {},
  onSubmit = () => {},
}) => {
  const classes = useStyles()

  const handleChange = (propertyName: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    switch (propertyName) {
      case 'date':
        const dateSegments = /(\d{4})-(\d{2})-(\d{2})/.exec(event.target.value)
        const [, year, month, day] = dateSegments as String[]
        const newDate = new Date(datetime.getTime())
        newDate.setDate(Number(day))
        newDate.setMonth(Number(month) - 1)
        newDate.setFullYear(Number(year))
        newDate.setSeconds(0)
        newDate.setMilliseconds(0)
        return onChange(propertyName, newDate)
      case 'time':
        const timeSegments = /(\d{2}):(\d{2})/.exec(event.target.value)
        const [, hours, minutes] = timeSegments as String[]
        const newTime = new Date(datetime.getTime())
        newTime.setHours(Number(hours))
        newTime.setMinutes(Number(minutes))
        newTime.setSeconds(0)
        newTime.setMilliseconds(0)
        return onChange(propertyName, newTime)
      case 'payedAmount':
        return onChange(propertyName, Number(event.target.value))
      default:
        return onChange(propertyName, event.target.value)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  const date = format(datetime, 'YYYY-MM-DD')
  const time = format(datetime, 'HH:mm')

  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={2} className={classes.center}>
        <Grid item>
          <TextField
            id="SessionDateInput"
            type="date"
            variant="outlined"
            label="Datum"
            defaultValue={date}
            fullWidth
            onChange={handleChange('date')}
          />
        </Grid>
        {/* if date in future, show time */}
        {isFuture(datetime) && (
          <Grid item>
            <TextField
              id="SessionTimeInput"
              type="time"
              variant="outlined"
              label="Uhrzeit"
              defaultValue={time}
              fullWidth
              onChange={handleChange('time')}
            />
          </Grid>
        )}
        {/* payed? amount */}
        <Grid item>
          <TextField
            id="SessionPayedAmountInput"
            type="number"
            variant="outlined"
            value={payedAmount || ''}
            label="Bezahlt"
            fullWidth
            onChange={handleChange('payedAmount')}
          />
        </Grid>
        {/* description */}
        <Grid item>
          <TextField
            id="SessionDescriptionInput"
            multiline
            variant="outlined"
            label="Beschreibung"
            value={description}
            fullWidth
            onChange={handleChange('description')}
          />
        </Grid>

        <Grid item>
          <Button fullWidth type="submit" variant="contained" color="primary">
            Hinzufügen
            <AddIcon />
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
