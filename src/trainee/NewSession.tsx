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
  onDatetimeChange?: (date: Date) => void
  onDescriptionChange?: (description: string) => void
  onPayedAmountChange?: (payedAmount: number) => void
  onSubmit?: () => void
}

export const NewSession: React.FC<ExternalProps> = ({
  datetime = new Date(),
  description = undefined,
  payedAmount = 0,
  onDatetimeChange = () => {},
  onDescriptionChange = () => {},
  onPayedAmountChange = () => {},
  onSubmit = () => {},
}) => {
  const classes = useStyles()

  const handleStringChange = (callback: (newValue: string) => void) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    callback(event.target.value)
  }

  const handleNumberChange = (callback: (newValue: number) => void) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    callback(Number(event.target.value))
  }

  const handleChangeDate = (event: ChangeEvent<HTMLInputElement>) => {
    const result = /(\d{4})-(\d{2})-(\d{2})/.exec(event.target.value)
    const [, year, month, day] = result as String[]
    const newDate = new Date(datetime.getTime())
    newDate.setDate(Number(day))
    newDate.setMonth(Number(month) - 1)
    newDate.setFullYear(Number(year))
    onDatetimeChange(newDate)
  }

  const handleChangeTime = (event: ChangeEvent<HTMLInputElement>) => {
    const result = /(\d{2}):(\d{2})/.exec(event.target.value)
    const [, hours, minutes] = result as String[]
    const newDate = new Date(datetime.getTime())
    newDate.setHours(Number(hours))
    newDate.setMinutes(Number(minutes))
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    onDatetimeChange(newDate)
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
            id="TrainingDateInput"
            type="date"
            variant="outlined"
            label="Datum"
            defaultValue={date}
            fullWidth
            onChange={handleChangeDate}
          />
        </Grid>
        {/* if date in future, show time */}
        {isFuture(datetime) && (
          <Grid item>
            <TextField
              id="TrainingTimeInput"
              type="time"
              variant="outlined"
              label="Uhrzeit"
              defaultValue={time}
              fullWidth
              onChange={handleChangeTime}
            />
          </Grid>
        )}
        {/* payed? amount */}
        <Grid item>
          <TextField
            id="TrainingPayedAmountInput"
            type="number"
            variant="outlined"
            value={payedAmount}
            label="Bezahlt"
            fullWidth
            onChange={handleNumberChange(onPayedAmountChange)}
          />
        </Grid>
        {/* description */}
        <Grid item>
          <TextField
            id="TrainingDescriptionInput"
            multiline
            variant="outlined"
            label="Beschreibung"
            value={description}
            fullWidth
            onChange={handleStringChange(onDescriptionChange)}
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
